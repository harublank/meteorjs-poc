import { Accounts } from "meteor/accounts-base";
import { WebApp } from "meteor/webapp";

Meteor.publish("availableUsers", function () {
    const allUsers = Meteor.users.find({}, {
        fields: {
            emails: 1,
            profile: true
        },
        transform: function (doc) {
            console.log({ doc }, 'doc is here')
            const { emails, profile: { role }, _id } = doc
            return {
                email: emails[0],
                role

            }
        }
    })
    const isEmpty = allUsers.count === 0


    if (isEmpty) {
        return this.ready()
    }

    return allUsers
})