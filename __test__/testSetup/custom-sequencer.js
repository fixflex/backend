// Importing the default export of the Sequencer class from the @jest/test-sequencer package
const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
    // Overriding the sort method of the base Sequencer class
    sort(tests) {
        // Making a shallow copy of the tests array to avoid modifying the original array
        const copy = Array.from(tests);
        // Sorting the copied array based on the path property of each test
        return copy.sort((testA, testB) => {
            // Extracting the file paths of the tests
            const pathA = testA.path;
            const pathB = testB.path;
            // Comparing the file paths lexicographically to determine the order
            if (pathA < pathB) {
                return -1; // If pathA comes before pathB, return -1
            }
            if (pathA > pathB) {
                return 1; // If pathA comes after pathB, return 1
            }
            return 0; // If both paths are equal, return 0
        });
    }
}

module.exports = CustomSequencer;
