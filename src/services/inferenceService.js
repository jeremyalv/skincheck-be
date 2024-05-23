const tf = require("@tensorflow/tfjs-node");
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();
  
    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;
    
    let label;
    if (confidenceScore > 50) {
      label = 'Cancer';
    } else {
      label = 'Non-cancer';
    }
  
    let suggestion;
    if (label === 'Cancer') {
      suggestion = 'Segera periksa ke dokter!';
    } else {
      suggestion = 'Selamat, tidak ada masalah!';
    }
  
    return {
      label,
      suggestion,
    };
  } catch (error) {
    throw new InputError(`Terjadi kesalahan input: ${error.message}`);
  }
}

module.exports = predictClassification;