/**
 * PSU CS Academic Track Recommender AI Module
 * Requires: TensorFlow.js (<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>)
 */

const PSU_AI = {
    isReady: false,
    model: null,
    metadata: null,

    /**
     * 1. Initialize the AI Model
     * @param {string} basePath - The folder path where the JSON model files are located.
     */
    async init(basePath = './') {
        try {
            // Load Metadata (for feature names, mean, and std scaling)
            const metaResponse = await fetch(`${basePath}training_data.json`);
            if (!metaResponse.ok) throw new Error("Could not load training_data.json");
            this.metadata = await metaResponse.json();

            // Load Pre-Trained Neural Network
            this.model = await tf.loadLayersModel(`${basePath}psu-model.json`);
            
            this.isReady = true;
            console.log("✅ PSU AI Module Loaded Successfully");
            return true;
        } catch (error) {
            console.error("❌ PSU AI Initialization Error:", error);
            return false;
        }
    },

    /**
     * 2. Get the list of exact questions the AI expects
     * Useful if the developer wants to dynamically build their UI.
     * @returns {Array<string>} Array of feature names
     */
    getExpectedInputs() {
        if (!this.isReady) throw new Error("AI is not initialized yet. Call PSU_AI.init() first.");
        return this.metadata.feature_names;
    },

    /**
     * 3. Run the Prediction
     * @param {Array<number>} userAnswers - Array of numbers matching the exact order of getExpectedInputs()
     * @returns {Array<Object>} Sorted array of recommended tracks with percentages
     */
    async predict(userAnswers) {
        if (!this.isReady) throw new Error("AI is not initialized yet. Call PSU_AI.init() first.");
        
        if (userAnswers.length !== this.metadata.feature_names.length) {
            throw new Error(`Input length mismatch. Expected ${this.metadata.feature_names.length} answers, but got ${userAnswers.length}.`);
        }

        // Scale Inputs mathematically based on the training dataset's mean and std
        const scaledInput = userAnswers.map((val, i) => {
            const std = this.metadata.scaler_std[i] === 0 ? 1 : this.metadata.scaler_std[i];
            return (val - this.metadata.scaler_mean[i]) / std;
        });

        // Run the Neural Network
        const inputTensor = tf.tensor2d([scaledInput]);
        const prediction = this.model.predict(inputTensor);
        const probabilities = await prediction.data();
        inputTensor.dispose(); // Free memory

        // Map the results to the track names and format as percentages
        let results = this.metadata.labels.map((label, index) => ({
            track: label, 
            percentage: parseFloat((probabilities[index] * 100).toFixed(2))
        }));

        // Sort from highest match to lowest match
        results.sort((a, b) => b.percentage - a.percentage);

        return results;
    }
};