export interface BaseModel {
  createdBy?: string;
  createdAt: Date;
  updatedBy?: string;
  updateAt: Date;
  deletedBy?: string;
  deletedAt?: Date;
  isActive: boolean;
}
