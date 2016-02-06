ProteinData = new Meteor.Collection('protein_data');
History = new Meteor.Collection('history');

if (Meteor.isClient) {
    // 手动进行发布和订阅的必要性是客户关心他们想要的，而不是把所有数据都发送过去
    Meteor.subscribe('allProteinData');
    Meteor.subscribe('allHistory');

    Template.userDetails.helpers({
        user: function() {
            return ProteinData.findOne();
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
            ProteinData.update(this._id, {
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

    Meteor.publish('allProteinData', function () {
        return ProteinData.find();
    });

    Meteor.publish('allHistory', function () {
        return History.find();
    });

    Meteor.startup(function() {

    });
}
