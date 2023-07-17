export function registerValidationRules() {
    return [
      body('account_type').exists().notEmpty().trim().withMessage('account type is required.'),
      body('authentication_type').exists().notEmpty().trim().withMessage('authentication type is required.'),
      body('first_name').if(body('authentication_type').equals('0')).notEmpty().withMessage('first name is required.'),
      body('last_name').if(body('authentication_type').equals('0')).notEmpty().withMessage('last name is required.'),
      body('password').if(body('authentication_type').equals('0')).notEmpty().withMessage('password is required.'),
      body('email').if(body('authentication_type').equals('0')).notEmpty().withMessage('email is required.'),
      body('social_id').if(body('authentication_type').equals('1')).notEmpty().withMessage('social id is required.'),
      body('social_id').if(body('authentication_type').equals('2')).notEmpty().withMessage('social id is required.'),
      body('social_id').if(body('authentication_type').equals('3')).notEmpty().withMessage('social id is required.'),
    ];
  }
  
export function loginValidationRules() {
    return [
      body('email').exists().notEmpty().trim().withMessage('Email is required.'),
      body('password').exists().notEmpty().trim().withMessage('Password is required.'),
    ];
  }