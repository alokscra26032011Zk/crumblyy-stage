
exports.PERMISSIONS = "permissions";
exports.X_API_KEY = "x-api-key";
exports.EXPIRES = "Expires";
exports.UID = "uid";
exports.ENG = "eng";
exports.GENERAL = "general";
exports.GLOBAL = "global";
exports.TNINE = "Tnine Infotech";
exports.TNINE_DP = "https://dl.crumblyy.com/assets/tnine-logo.jpg";
exports.AUDIENCE = "audience";
exports.AUTHOR = "author";
exports.CATEGORY = "category";
exports.COMMENTS = "comments";
exports.CONTENT_BODY = "contentBody";
exports.IMAGES = "images";
exports.VIDEOS = "videos";
exports.TAGS = "tags";
exports.TITLE = "title";
exports.APPROVED = "approved";
exports.APPROVED_ON = "approvedOn";
exports.BOOKMARKS = "bookmarks";
exports.CATEGORY = "category";
exports.FLAGGED = "flagged";
exports.UPVOTES = "upvotes";
exports.DEV = "dev";
exports.PLATFORM = "platform";
exports.PRIORITY = "priority";
exports.ANDROID = "android";
exports.CREATED_AT = "createdAt";
exports.DESCENDING = "descending";
exports.PASSWORD = "password";
exports.GOOGLE_TOKEN = "google-token";
exports.EMAIL = "email";
exports.EMAIL_AUTH = "email-auth";
exports.GOOGLE_AUTH = "google-auth";
exports.BCRYPT = "bcrypt";
exports.JWT = "jwt";


/* -------------------
----- PERMISSIONS -----
----------------------- */

exports.END_CLIENT = "END-CLIENT";
exports.MODERATOR = "MODERATOR";
exports.HANDLER = "HANDLER";
exports.ACCESS_DENIED = "ACCESS-DENIED";
exports.SELF = "SELF";
exports.CREATE_END_CLIENT = "CREATE-END-CLIENT";
exports.CREATE_CONTENT = "CREATE-CONTENT";
exports.UPDATE_CONTENT = "UPDATE-CONTENT";
exports.DELETE_CONTENT = "DELETE-CONTENT";
exports.CREATE_BANNER = "CREATE-BANNER";
exports.CONTENT_REVIEW = "CONTENT-REVIEW";
exports.CREATE_TAGS = "CREATE-TAGS";
exports.CREATE_HANDLER = "CREATE-HANDLER";
exports.UPLOAD_FILES = "UPLOAD-FILES";
exports.CREATE_CATEGORY = "CREATE-CATEGORY";
exports.CREATE_TOPIC = "CREATE-TOPIC";
exports.CREATE_DIALOG = "CREATE-DIALOG";
exports.SEND_NOTIFICATION="SEND-NOTIFICATION";
/* -------------------
-------- LOGS ---------
----------------------- */

// banners
exports.LOG_BANNERS_CREATE = "log-banners-create";
exports.LOG_BANNERS_LIST = "log-banners-list";

// content
exports.LOG_CONTENT_CREATE = "log-content-create";
exports.LOG_CONTENT_GET = "log-content-get";
exports.LOG_CONTENT_UPDATE = "log-content-update";
exports.LOG_CONTENT_DELETE = "log-content-delete";
exports.LOG_CONTENT_REVIEW_LIST = "log-content-review-list";
exports.LOG_CONTENT_CREATE_FLAG = "log-content-create-flag";
exports.LOG_CONTENT_FIND_CONTENT_WITH_TAG = "log-content-find-content-with-tag";
exports.LOG_CONTENT_SEARCH = "log-content-search";
exports.LOG_CONTENT_FILTER_BY_CATEGORY = "log-content-filter-by-category";
exports.LOG_CONTENT_SORT_BY_DATE = "log-content-sort-by-date";
exports.LOG_CONTENT_LIST_AFTER_ID = "log-content-list-after-id";
exports.LOG_CONTENT_LIST_BY_CATEGORY = "log-content-list-by-category";

// tags
exports.LOG_TAGS_CREATE = "log-tags-create";
exports.LOG_TAGS_GET_BY_ID = "log-tags-get-by-id";
exports.LOG_TAGS_LIST_BY_NAME = "log-tags-list-by-name";

// users
exports.LOG_USERS_CREATE = "log-users-create";
exports.LOG_USERS_GET_WITH_UID = "log-users-get-with-uid";
exports.LOG_USERS_PERMISSIONS = "log-users-permissions";
exports.LOG_USERS_UPDATE = "log-users-update";
exports.LOG_USERS_FIND_WITH_GID = "log-users-find-with-gid";
exports.LOG_USERS_FIND_WITH_EMAIL = "log-users-find-with-email";

// bcrypt
exports.LOG_BCRYPT_ENCRYPT = "log-bcrypt-encrypt";
exports.LOG_BCRYPT_COMPARE = "log-bcrypt-compare";

// storage
exports.LOG_SPACES_DP_UPLOAD = "log-spaces-dp-upload";
exports.LOG_SPACES_CONTENT_UPLOAD = "log-spaces-content-upload";

// token
exports.LOG_TOKEN_GENERATE_CLIENT = "log-token-generate-client";
exports.LOG_TOKEN_GENERATE_OTHERS = "log-token-generate-others";
exports.LOG_TOKEN_VERIFY = "log-token-verify";

// category
exports.LOG_CATEGORY_CREATE = "log-category-create";
exports.LOG_CATEGORY_READ = "log-category-read";
exports.LOG_CATEGORY_LIST = "log-category-read";
// topic
exports.LOG_TOPIC_CREATE = "log-topic-create";
exports.LOG_TOPIC_READ = "log-topic-read";

// others
exports.LOG_EXPRESS_UNHANDLED_ERROR = "log-express-unhandled-error";
exports.LOG_ACCESS_DENIED = "log-access-denied";
exports.LOG_DB_START = "log-db-start";

/* -------------------
------- OTHERS --------
----------------------- */

exports.ARRAY = 'ARRAY';
exports.OBJECT = 'OBJECT';
exports.STRING = 'STRING';
exports.NULL = 'NULL';
exports.UNDEFINED = 'UNDEFINED';
exports.UNKNOWN = 'UNKNOWN';

exports.ZOHO_SMTP = "smtp.zoho.com";

/* -------------------
------- SPACES --------
----------------------- */

exports.SPACES_USERS_DP = process.env.SPACES + '/' + process.env.SPACES_USERS_DP;
exports.SPACES_CONTENT_IMAGE = process.env.SPACES + '/' + process.env.SPACES_CONTENT_IMAGES;