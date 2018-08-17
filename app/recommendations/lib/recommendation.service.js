
const _ = require('lodash'),
Promise = require('bluebird'),

ModelService = require('./model.service'),
SampleService = require('./sample.service'),

UserRecommendation = ModelService.model.UserRecommendation,
UserDoNotRecommend = ModelService.model.UserDoNotRecommend;


let concurrency = 2;


const getAllRecommendationsForUser = ModelService.getAllRecommendationsForUser;


const calculateAndContribute = (userId, userSimilarity, items, otherUserItemWeight) => {

if( !_.has(items, otherUserItemWeight.item) ) {
    items[otherUserItemWeight.item] = {
        item: otherUserItemWeight.item,
        itemMetadata: otherUserItemWeight.itemMetadata,
        weight: 0
    };
}

var contribution = otherUserItemWeight.weight * userSimilarity.similarity;

items[otherUserItemWeight.item].weight += contribution;
};


const createItemRecommendationsForUser = (userId, userSimilarities) => {
return new Promise((resolve, reject) => {

    var userSimilarityMap = _.groupBy(userSimilarities, 'user'),
        otherUserIds = _.keys(userSimilarityMap, 'user');

    ModelService.getCursorForUserItemWeightsForUsers(otherUserIds)
        .then((otherUserItemWeightsCursor) => {

            var items = {};

            otherUserItemWeightsCursor.on('data', (otherUserItemWeights) => {
                var otherUserId = otherUserItemWeights.user;
                var userSimilarity = userSimilarityMap[otherUserId][0];

                otherUserItemWeights.itemWeights.forEach(calculateAndContribute.bind(null, userId, userSimilarity, items));
            });

            otherUserItemWeightsCursor.on('end', () => {
              
                resolve(items);
            });

        });

});
};


const transformUserItemRecommendations = (userId, userItemRecommendations) => {

return new Promise((resolve, reject) => {

    var recommendations = _.map( _.keys(userItemRecommendations), (itemId) => {
        return userItemRecommendations[itemId];
    }).filter((recommendation) => {
        return recommendation.weight > 0;
    });

    resolve({
        user: userId,
        recommendations: recommendations
    });

});

};


const transformUserSimilaritiesForUser = (userId, userSimilarities) => {
var userIdString = userId + '';

return Promise.map(userSimilarities, (userSimilarity) => {
    return {
        user: _.isEqual(userSimilarity.users[0] + '', userIdString ) ? userSimilarity.users[1] : userSimilarity.users[0],
        similarity: userSimilarity.similarity
    };
}, { concurrency: concurrency }).filter((entry) => {
    return entry.user !== userIdString;
});

};


const createRecommendationsFromWeightsAndSimilarities = ( userId, userSimilarities ) => {
return createItemRecommendationsForUser(userId, userSimilarities)
    .then( transformUserItemRecommendations.bind(this, userId) );
};


const calculateAndSaveUserRecommendations = ( userId ) => {
var threshold = 0.1;

return ModelService.getAllSimilaritiesForUser(userId, threshold)
    .then( transformUserSimilaritiesForUser.bind(this, userId) )
    .then( createRecommendationsFromWeightsAndSimilarities.bind(this, userId) )
    .then( (recommendationsToSave) => {

        return UserRecommendation.insertMany([recommendationsToSave])
                .then(() => {
                    return Promise.resolve();
                });
    } );
};


const calculateUsersRecommendations = ( allUserIds ) => {
return Promise.map(allUserIds, calculateAndSaveUserRecommendations, { concurrency: concurrency });
};


const recalculateUserRecommendations = () => {

return ModelService.dropUserRecommendations()
    .then( ModelService.getAllUserIdsWithActivity )
    .then( calculateUsersRecommendations )
    .catch( (err) => {
        return Promise.reject(err);
    });
};


const markRecommendationDNR = (userId, itemId, itemMetadata) => {

return ModelService.getDoNotRecommendByUser(userId)
    .then( (existingRecord) => {

        if( _.isEmpty(existingRecord) ) {
            existingRecord = new UserDoNotRecommend({
                user: userId,
                doNotRecommend: []
            });
        }

        existingRecord.doNotRecommend.push({
            item: itemId,
            itemMetadata: itemMetadata
        });

        return existingRecord.save();
    });

};

/**
* Updates the concurrency level used for calculating user-to-user similarities. Default: 2
* @param {number} newConcurrency - the number of concurrent users whose similarity will be calculated against other users
*/
const setConcurrency = (newConcurrency) => {
concurrency = newConcurrency;
};

module.exports = {
getAllRecommendationsForUser,
markRecommendationDNR,
recalculateUserRecommendations,
setConcurrency,

// Backwards compatibility
sampleRecommendationsForUser: SampleService.sampleRecommendationsForUser
};