'use strict';
var pakkit = require('./');

// First we define our reusable attribute types. Types can extend each other as needed.
var types = {
  'address': {
    type: 'uint16le'
  },
  'payloadWithLength': {
    write: function(builder, data) {
      builder.uint16le(data.length).buffer(data);
    },
    read: function(parser, attribute) {
      parser
        .uint16le(attribute.name + 'Length')
        .buffer(attribute.name, attribute.name + 'Length')
        .tap(function() {
          delete(this.vars[attribute.name + 'Length']);
        });
    }
  }
};

// Next we define our packets, and export them (so each has read and write functions)
// Property order is important! Yes, it's not in the spec for JS (but it works.)
var packets = pakkit.export({
  MESSAGE : {
    FromAddress: 'address',
    ToAddress: 'address',
    Attachment: 'payloadWithLength',
    Options: {
      mask: ['urgent', 'secret', 'replyRequested'],
      type: 'uint8'
    }
  }
}, types);

var message = {
  ToAddress: 12345,
  FromAddress: 54321,
  Options: {
    replyRequested: true,
    urgent: true
  },
  Attachment: new Buffer([1,2,3,4,5])
};

console.log('Message', message);

var buffer = packets.MESSAGE.write(message);

console.log('Wrote message to buffer', buffer);

var parsed = packets.MESSAGE.read(buffer);

console.log('Read message from buffer', parsed);