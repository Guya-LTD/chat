[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)


user           customerService

message
    id
    sender (user id)
    recipient (user id)
    content
    timestamp

sequelize init

sequelize model:generate --name Messages --attributes sender:string,senderName:string,recipient:string,recipientName:string,content:text

sequelize seed:generate --name Messages

# Genral Naming
CU => Customer
EM => Empyloyee
AD => Admin


1000 --> General
2000 --> E-commerce
    2100-> Admin
        2110 -> Admin
    2200 --> Staff
        2210 --> Customer Service
        2220 --> Identity Manager
        2230 --> Marketing Administrator
        2240 --> Warehouse Manager
        2250 --> Warehouse Clerk
    2300 --> Customer
        2210 --> Consumer Customer
        2220 --> Vendor Customer
3000 --> Xpress
    3100 --> Admin
        3110 --> Admin
    3200 --> Staff
        3210 --> Delivery Guy
        3220 --> Front Desk Receptionist
    3300 --> Customer
        3310 --> Businness
        3320 --> Personal
        3330 --> Government



examples. CU-2210 means consumenr customer