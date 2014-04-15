node-pakkit
-----------

Node.JS module to read/write objects to/from buffers using concise packet definitions.

# Example

First you define your attribute types and packets...

```javascript

var types = {
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

var packets = pakkit.export({
  MESSAGE : {
    FromAddress: 'uint16le',
    ToAddress: 'uint16le',
    Attachment: 'payloadWithLength',
    Options: {
      mask: ['urgent', 'secret', 'replyRequested'],
      type: 'uint8'
    }
  }
}, types);

```


Then you can use them!
```javascript
// Object -> Buffer
var buffer = packets.MESSAGE.write({
  ToAddress: 12345,
  FromAddress: 54321,
  Options: {
    replyRequested: true,
    urgent: true
  },
  Attachment: new Buffer([1,2,3,4,5])
});

// Buffer -> Object
var parsed = packets.MESSAGE.read(buffer);
```

More docs coming "soon", for now... see how it is used in [node-zigbee](https://github.com/ninjablocks/node-zigbee)




Brought to you by your friendly neighbourhood ninjas @ [Ninja Blocks Inc.](http://ninjablocks.com)
