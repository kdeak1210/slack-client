/** Accept an array of errors and return an object of the errors
 *
 *  [{ path: '', message: ''}]
 *
 *  Transform into an Object
 *
 *  {
 *    path1: ['e1', 'e2', ...],
 *    path2: ['e1', 'e2', ...]
 *  }
 */

export default errors =>
  errors.reduce((acc, cv) => {
    if (cv.path in acc) {
      acc[cv.path].push(cv.message);
    } else {
      acc[cv.path] = [cv.message]; // put in an ARRAY (not just message string)
    }

    return acc;
  }, {});

// export default (errors) => {
//   const errorsObject = {};

//   errors.forEach((error) => {
//     const { path, message } = error;
//     if (!errorsObject[path]) {
//       errorsObject[path] = [];
//     }
//     errorsObject[path].push(message);
//   });

//   return errorsObject;
// };
