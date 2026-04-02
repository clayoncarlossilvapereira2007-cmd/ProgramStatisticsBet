const tf = require('@tensorflow/tfjs-node');

class MLService {
  constructor() {
    this.model = null;
    this.isTrained = false;
  }

  async trainModel() {
    try {
      // Create simulated training data
      const trainingData = this.generateTrainingData(1000);
      const xs = tf.tensor2d(trainingData.features);
      const ys = tf.tensor2d(trainingData.labels, [trainingData.labels.length, 1]);

      // Define model
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [6], units: 64, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 32, activation: 'relu' }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 1, activation: 'sigmoid' })
        ]
      });

      this.model.compile({
        optimizer: 'adam',
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });

      // Train model
      await this.model.fit(xs, ys, {
        epochs: 50,
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (epoch % 10 === 0) {
              console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
            }
          }
        }
      });

      xs.dispose();
      ys.dispose();
      this.isTrained = true;
      console.log('✅ ML Model trained successfully');
    } catch (error) {
      console.error('❌ ML Training failed:', error);
      this.isTrained = false;
    }
  }

  generateTrainingData(count) {
    const features = [];
    const labels = [];

    for (let i = 0; i < count; i++) {
      // Features: [homeForm, homeAttack, homeDefense, awayForm, awayAttack, awayDefense]
      const homeForm = Math.random();
      const homeAttack = Math.random();
      const homeDefense = Math.random();
      const awayForm = Math.random();
      const awayAttack = Math.random();
      const awayDefense = Math.random();

      // Simulate realistic outcome
      const homeStrength = (homeForm * 0.35) + (homeAttack * 0.3) + ((1 - homeDefense) * 0.35);
      const awayStrength = (awayForm * 0.35) + (awayAttack * 0.3) + ((1 - awayDefense) * 0.35);
      
      const homeWinProb = homeStrength / (homeStrength + awayStrength);
      const outcome = Math.random() < homeWinProb ? 1 : 0;

      features.push([homeForm, homeAttack, homeDefense, awayForm, awayAttack, awayDefense]);
      labels.push(outcome);
    }

    return { features, labels };
  }

  async predict(features) {
    if (!this.isTrained || !this.model) {
      await this.trainModel();
    }

    try {
      const inputTensor = tf.tensor2d([features]);
      const prediction = this.model.predict(inputTensor);
      const prob = await prediction.data();
      
      inputTensor.dispose();
      prediction.dispose();
      
      return Array.from(prob)[0];
    } catch (error) {
      console.error('Prediction error:', error);
      return 0.5; // Fallback
    }
  }
}

module.exports = new MLService();
