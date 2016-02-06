Users = new Meteor.Collection('users');
History = new Meteor.Collection('history');

if (Meteor.isClient) {
    // 手动进行发布和订阅的必要性是客户关心他们想要的，而不是把所有数据都发送过去
    Meteor.subscribe('allUsers');
    Meteor.subscribe('allHistory');

    Template.userDetails.helpers({
        user: function() {
            return Users.findOne();
        }
    });

    Template.history.helpers({
        historyItem: function() {
            return History.find({}, {
                sort: {
                    date: -1
                },
                limit: 5
            });
        }
    });

    Template.userDetails.events({
        'click #addAmount': function(e) {
            e.preventDefault();
            var amount = parseInt($('#amount').val());
            Users.update(this._id, {
                $inc: {
                    total: amount
                }
            });
            History.insert({
                value: amount,
                date: new Date().toTimeString(),
                userId: this._id
            });
        }
    });
}

if (Meteor.isServer) {

    Meteor.publish('allUsers', function () {
        return Users.find();
    });

    Meteor.publish('allHistory', function () {
        return History.find();
    });

    Meteor.startup(function() {
        if (Users.find().count() === 0) {
            Users.insert({
                total: 120,
                goal: 200
            });
        }

        if (History.find().count() === 0) {
            History.insert({
                date: new Date().toTimeString(),
                value: 30
            });

            History.insert({
                date: new Date().toTimeString(),
                value: 20
            });

            History.insert({
                date: new Date().toTimeString(),
                value: 10
            });
        }
    });
}
