ProteinData = new Meteor.Collection('protein_data');
History = new Meteor.Collection('history');

Meteor.methods({
    addProtein: function(amount) {

        if (!this.isSimulation) {
            var Future = Npm.require('fibers/future');
            var future = new Future();
            Meteor.setTimeout(function() {
                future.wait();
            }, 3 * 1000);
        } else{
            amount = 500;
        }

        ProteinData.update({userId: this.userId}, {
            $inc: {
                total: amount
            }
        });
        History.insert({
            value: amount,
            date: new Date().toTimeString(),
            userId: this.userId
        });
    }
});

if (Meteor.isClient) {
    Deps.autorun(function() {
        if (Meteor.user()) {
            console.log("User logged in: " + Meteor.user().profile.name);
        }else {
            console.log("User logged out!");
        }
    });

    // 手动进行发布和订阅的必要性是客户关心他们想要的，而不是把所有数据都发送过去
    Meteor.subscribe('allProteinData');
    Meteor.subscribe('allHistory');

    Template.userDetails.helpers({
        user: function() {
            var data = ProteinData.findOne();
            if (!data) {
                data = {
                    userId: Meteor.userId(),
                    total: 0,
                    goal: 200
                };
                ProteinData.insert(data);
            }

            return data;
        },
        lastAmount: function() {
            return Session.get('lastAmount');
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

            Meteor.call('addProtein', amount, function (error, id) {
                if (error) {
                    return alert(error.reason);
                }
            });

            Session.set('lastAmount', amount);
        },
        'click #quickSubstract': function(e) {
            e.preventDefault();
            ProteinData.update(this._id, {$inc: {total: -100}});
        }
    });
}

if (Meteor.isServer) {

    Meteor.publish('allProteinData', function () {
        return ProteinData.find({ userId: this.userId });
    });

    Meteor.publish('allHistory', function () {
        return History.find({ userId: this.userId }, {sort: {date: -1}, limit: 5});
    });

    Meteor.startup(function() {

    });
}
