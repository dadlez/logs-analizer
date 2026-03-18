export enum Type {
  Added = 1,
  Deleted = 2,
  Modified = 3,
}

export const TypeLabels: Record<Type, string> = {
  [Type.Added]: "Added",
  [Type.Deleted]: "Deleted",
  [Type.Modified]: "Modified",
};

export const TypeOptions = Object.values(Type)
  .filter((v): v is Type => typeof v === "number")
  .map((v) => ({ value: v, label: TypeLabels[v] }));

export enum EntityType {
  Unknown = 0,
  ContractHeaderEntity = 1,
  AnnexHeaderEntity = 2,
  AnnexChangeEntity = 3,
  FileEntity = 4,
  InvoiceEntity = 5,
  PaymentScheduleEntity = 6,
  ContractFundingEntity = 7,
}

export const EntityTypeLabels: Record<EntityType, string> = {
  [EntityType.Unknown]: "Unknown",
  [EntityType.ContractHeaderEntity]: "Contract Header",
  [EntityType.AnnexHeaderEntity]: "Annex Header",
  [EntityType.AnnexChangeEntity]: "Annex Change",
  [EntityType.FileEntity]: "File",
  [EntityType.InvoiceEntity]: "Invoice",
  [EntityType.PaymentScheduleEntity]: "Payment Schedule",
  [EntityType.ContractFundingEntity]: "Contract Funding",
};

export const EntityTypeOptions = Object.values(EntityType)
  .filter((v): v is EntityType => typeof v === "number")
  .map((v) => ({ value: v, label: EntityTypeLabels[v] }));
