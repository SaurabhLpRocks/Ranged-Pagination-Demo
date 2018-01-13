export const BaseMongooseSchema = {
  createdBy: { type: String, required: false },
  updatedBy: { type: String, required: false },
  deletedBy: { type: String, required: false },
  isActive: { type: Boolean, required: false, default: true },
};
