import { Mongo } from 'meteor/mongo'

export const contactsCollection = new Mongo.Collection("contacts")

contactsCollection.allow({
    insert: function (I) {
        return true
    },
    update: function () {
        return true
    },
    remove: function () {
        return true
    }
})

