import { Document, Schema, Model, SchemaDefinition, SchemaOptions } from 'mongoose';

interface CustomSchemaOptions extends SchemaOptions {
  toJSON?: {
    transform?: (
      doc: Document,
      ret: Record<string, unknown>,
      options: Record<string, unknown>
    ) => void;
  };
}

interface CustomSchema extends Schema {
  options: CustomSchemaOptions;
}

// Helper function to delete a property at a given path in an object
const deleteAtPath = (
  obj: Record<string, unknown>,
  path: string[],
  index: number
): void => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  deleteAtPath(obj[path[index]] as Record<string, unknown>, path, index + 1);
};

const toJSON = (schema: CustomSchema): void => {
  let transform: (
    doc: Document,
    ret: Record<string, unknown>,
    options: Record<string, unknown>
  ) => void;
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  // Override the toJSON transform function
  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(
      doc: Document,
      ret: Record<string, unknown>,
      options: Record<string, unknown>
    ): void {
      // Iterate over each path in the schema
      Object.keys(schema.paths).forEach((path) => {
        // Check if the path has the private option set to true
        if (
          // @ts-ignore
          schema.paths[path]?.options?.private
        ) {
          deleteAtPath(ret, path.split('.'), 0);
        }
      });

      // @ts-ignore
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;

      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
};

export default toJSON;
