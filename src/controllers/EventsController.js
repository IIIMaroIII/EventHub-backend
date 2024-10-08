import CONSTANTS from '../constants/index.js';
import CreateResponseObj from '../helpers/CreateResponseObj.js';
import { HttpError } from '../helpers/HttpError.js';
import { EventsService } from '../services/eventsService.js';

const { SUCCESS, ERRORS } = CONSTANTS.MESSAGES;

const getAllEvents = async (req, res, next) => {
  const result = await EventsService.getAllEvents(req.query);

  res.json({
    status: 200,
    message: `${SUCCESS.FETCHED} data `,
    result,
  });
};

const findEventById = async (req, res, next) => {
  const { id } = req.params;

  const data = await EventsService.findEventById(id);

  res.json(CreateResponseObj(200, `${SUCCESS.FETCHED} event by ID`, data));
};

const addEvent = async (req, res, next) => {
  const data = req.body;
  const result = await EventsService.addEvent(data);

  res
    .status(201)
    .json(CreateResponseObj(201, `${SUCCESS.CREATED} event`, result));
};

const upsertEvent = async (req, res, next) => {
  const { id } = req.params;

  const result = await EventsService.upsertEvent({ _id: id }, req.body, {
    upsert: true,
  });

  console.log(result);

  if (!result) throw HttpError(500);

  const status = result.isNew ? 201 : 200;
  const message = result.isNew
    ? `${SUCCESS.CREATED} event with id ${id}`
    : `${SUCCESS.UPDATE} event by id ${id}`;

  res.status(status).json(CreateResponseObj(status, message, result.data));
};

const updateEvent = async (req, res, next) => {
  const { id } = req.params;

  const result = await EventsService.upsertEvent({ _id: id }, req.body);

  if (!result)
    throw HttpError(404, `The event ${ERRORS.NOT_FOUND_BY_ID} ${id}`);

  res.json(
    CreateResponseObj(
      200,
      `${SUCCESS.UPDATE} event with id ${id}`,
      result.data,
    ),
  );
};

const deleteEvent = async (req, res, next) => {
  const { id } = req.params;

  const result = await EventsService.deleteEvent(id);

  if (!result)
    throw HttpError(404, `The event ${ERRORS.NOT_FOUND_BY_ID} ${id}`);

  res.json(
    CreateResponseObj(200, `${SUCCESS.DELETE} event with id ${id}`, result),
  );
};

export const EventsController = {
  getAllEvents,
  addEvent,
  findEventById,
  deleteEvent,
  updateEvent,
  upsertEvent,
};
