var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SessionSchema = Schema({
  user_id: {type: Schema.ObjectId, ref: 'pengguna'},
  access_token: {type: String, min: 1, max: 100, required: true},
  started_at: { type: Date, default: Date.now},
  end_at: { type: Date, default: null},
  platform: {type: String, min: 1, max: 100, required: true},
  created_at: { type: Date, default: Date.now},
  updated_at: { type: Date, default: Date.now}

},{collection: 'session'});

//Export model
module.exports = mongoose.model('session', SessionSchema);
