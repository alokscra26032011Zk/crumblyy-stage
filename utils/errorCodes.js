/*
crumblyy-backend
errorcodes

@author Saksham
@note Last Branch Update - 
     
@note Created on 2018-05-21 by Saksham
@note Updates :
    @author Alok
    Complete Access Denied
*/
exports.UNKNOWN = 600;

exports.TOKEN_NOT_PROVIDED = 601;
exports.TOKEN_EXPIRED = 602;
exports.TOKEN_MALFORMED = 603;
exports.TOKEN_INVALID_KEY = 604;

exports.BCRYPT_HASH_FAILED = 608;
exports.BCRYPT_COMPARE_FAILED = 609;

exports.ACCESS_DENIED = 610;
exports.USER_NOT_EXIST = 611;
exports.DATABASE_ERROR = 612;
exports.HEADER_NOT_PROVIDED = 613;
exports.BODY_PARAMETER_NOT_PROVIDED = 614;
exports.QUERY_PARAMETER_NOT_PROVIDED = 615;
exports.NOT_FOUND = 616;
exports.USER_ALREADY_EXISTS = 617;
exports.HACK_ALREADY_EXISTS = 618;
exports.HACK_NOT_EXISTS = 619;
exports.MALFORMED = 620;
exports.TAG_ALREADY_EXISTS = 621;
exports.TAG_NOT_EXISTS = 622;
exports.GOOGLE_AUTH_ERROR = 623;
exports.GOOGLE_AUTH_ERROR_TOKEN_EXPIRED = 624;
exports.USER_MISC_ERRORS = 625;
exports.SPACES_ERROR = 626;
exports.CATEGORY_NOT_EXIST = 627;
exports.TOPIC_NOT_EXIST = 628;
exports.ID_ALREADY_EXISTS = 629;
exports.DIALOG_NOT_EXIST = 630;
exports.DIALOG_ALREADY_EXIST = 631;
exports.COMPLETE_ACCESS_DENIED=632;
exports.INTERNAL_SERVER_ERROR=633;
exports.BANNER_NOT_EXIST=634;
exports.BANNER_ALREADY_EXIST=635;
exports.LINK = process.env.ERROR_API_LINK;