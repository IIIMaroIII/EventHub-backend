import mongoose, { model, Schema } from 'mongoose';
import { MongooseHooks } from './hooks/mongooseHooks.js';
import { MESSAGES } from '../../constants/messages.js';
import { regex } from '../../constants/regex.js';

const { ERRORS } = MESSAGES;

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, `The title ${ERRORS.REQUIRED}`],
    },
    description: {
      type: String,
      required: [true, `The description ${ERRORS.REQUIRED}`],
    },
    eventDate: {
      type: String,
      default: new Date().toISOString(),
      validate: {
        validator: (v) => regex.eventDate.test(v),
        message: ({ value }) => `${value} ${ERRORS.EVENT_DATE}`,
      },
    },
    participationsID: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      validate: {
        validator: (v) =>
          Array.isArray(v) && v.every((id) => mongoose.isValidObjectId(id)),
        message: ({ value }) => `${value} ${ERRORS.MONGOOSE_ID}`,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

eventSchema.post('save', MongooseHooks.saveError);

eventSchema.post('findOneAndUpdate', MongooseHooks.saveError);

eventSchema.pre('findOneAndUpdate', MongooseHooks.updateOptions);

export const eventsModel = model('events', eventSchema);
