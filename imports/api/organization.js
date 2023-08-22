import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import SimpleSchema from "simpl-schema";

export const organizationCollection = new Mongo.Collection('organization')


organizationCollection.allow({
    insert: function () {
        return true
    },
    update: function () {
        return true
    },
    remove: function (userId, doc) {
        const isMyDoc = doc.userId === userId
        return isMyDoc ? true : false
    },

})
// Meteor.publish('organizationData', function () {
//     return organizationCollection.find({})
// })
