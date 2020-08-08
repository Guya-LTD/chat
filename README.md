[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


user           customerService

message
    id
    sender (user id)
    recipient (user id)
    content
    timestamp

sequelize init

sequelize model:generate --name Messages --attributes sender:string,recipient:string,content:text

sequelize seed:generate --name Messages