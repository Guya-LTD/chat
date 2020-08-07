user           customerService

message
    id
    sender (user id)
    recipient (user id)
    content
    timestamp


sequelize model:generate --name Messages --attributes sender:string, recipient:string, content:text

sequelize seed:generate --name Messages