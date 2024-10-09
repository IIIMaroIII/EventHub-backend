import CONSTANTS from '../constants/index.js';
import { eventsModel } from '../db/models/eventsModel.js';
import { HttpError } from '../helpers/HttpError.js';

const { ERRORS } = CONSTANTS.MESSAGES;

const getAllEvents = async ({ page, perPage }) => {
  const skip = (page - 1) * perPage;

  const result = await eventsModel.find().skip(skip).limit(perPage);

  return result;
};

const addEvent = async (data) => {
  const result = await eventsModel.create(data);

  return result;
};

const findEventById = async (eventId) => {
  const result = await eventsModel.findById(eventId);

  if (!result)
    throw HttpError(404, `The event ${ERRORS.NOT_FOUND_BY_ID} ${eventId}`);

  return result;
};

const upsertEvent = async (filter, data, options = {}) => {
  const result = await eventsModel.findOneAndUpdate(filter, data, {
    includeResultMetadata: true,
    ...options,
  });
  console.log(result);

  if (!result || !result.value) return null;

  return {
    data: result.value,
    isNew: !result?.lastErrorObject?.updatedExisting,
  };
};

const deleteEvent = async (id) => eventsModel.findOneAndDelete(id);

export const EventsService = {
  getAllEvents,
  addEvent,
  findEventById,
  deleteEvent,
  upsertEvent,
};
