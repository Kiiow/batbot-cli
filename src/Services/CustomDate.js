

function getCurrentDateFormatted() {
    return new Date().toLocaleString(undefined, {
              day:    'numeric',
              month:  'numeric',
              year:   'numeric',
              hour:   '2-digit',
              minute: '2-digit',
          });
}

module.exports = {
    getCurrentDateFormatted
};