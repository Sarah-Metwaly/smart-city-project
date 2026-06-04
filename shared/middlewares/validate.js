//Zod validates the request body before reaching mongoose schema.
const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body); //safeParse returns an object with success and data or error properties, it doesn't throw an error like parse() does, so we can handle validation errors gracefully.

    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
        return res.status(400).json({ status: 'fail', message: 'Validation failed', errors });
    }
    req.body = result.data; // Use the parsed and validated data
    next();
  };
};

module.exports = {validate};
