import Joi from 'joi';

class DietApp {
  private numDaysInput: HTMLInputElement;
  private caloriesInput: HTMLInputElement;
  private resultDiv: HTMLDivElement;

  constructor() {
    this.numDaysInput = document.getElementById('numDays') as HTMLInputElement;
    this.caloriesInput = document.getElementById('caloriesInput') as HTMLInputElement;
    this.resultDiv = document.getElementById('result') as HTMLDivElement;
    this.analyzeCalories = this.analyzeCalories.bind(this);
    this.showIncreasingSequence = this.showIncreasingSequence.bind(this);
  }

  private validateInput(): { numDays: number, caloriesArray: number[] } | null {
    const numDays: number = parseInt(this.numDaysInput.value, 10);
    const caloriesInputValue = this.caloriesInput.value;

    // Validate the input using Joi
    const schema = Joi.object({
      numDays: Joi.number().integer().min(1).required(),
      caloriesArray: Joi.string().pattern(/^\d+(,\s*\d+)*$/).required(),
    });

    const validation = schema.validate({ numDays, caloriesArray: caloriesInputValue });

    if (validation.error) {
      alert('Validation Error: ' + validation.error.message);
      return null;
    }

    const caloriesArray = caloriesInputValue.split(',').map(cal => parseInt(cal.trim(), 10));

    if (caloriesArray.length !== numDays) {
      alert('Number of days and calories input do not match.');
      return null;
    }

    return { numDays, caloriesArray };
  }

  analyzeCalories(): void {
    const validatedInput = this.validateInput();
    if (!validatedInput) return;
    

    const { numDays, caloriesArray } = validatedInput;
    if (numDays === 1 || numDays === 0) {
      alert('Number of days should be more than 2');
      return;
    }
    const caloriesManipulator = new ArrayManipulator(caloriesArray);
    const maxCalorieIntake = caloriesManipulator.getMaxProductOfAdjacentElements();

    this.resultDiv.innerText = `Maximum Calorie Intake in contiguous Days : ${maxCalorieIntake}`;
  }

  showIncreasingSequence(): void {
    const validatedInput = this.validateInput();
    if (!validatedInput) return;

    const { numDays, caloriesArray } = validatedInput;

    if (numDays === 1 || numDays === 0) {
      alert('Number of days should be more than 2');
      return;
    }

    const caloriesManipulator = new ArrayManipulator(caloriesArray);
    const increasingSequence = caloriesManipulator.getIncreasingSequence();

    this.resultDiv.innerText = `Increase in Calories intake Contiguously: ${increasingSequence.sequence}\nRespective Days: ${increasingSequence.indices}\nDay's Count: ${increasingSequence.dayCount}`;
  }
}

// Enhance the ArrayManipulator class for reusability
class ArrayManipulator {
  private array: number[];

  constructor(array: number[]) {
    this.array = array;
  }

  getMaxProductOfAdjacentElements(): number {
   

    for (let i = 0; i < this.array.length - 1; i++) {
      const product = this.array[i] * this.array[i + 1];
      maxProduct = Math.max(product);
    }

    return maxProduct;
  }

  getIncreasingSequence(): { indices: number[], sequence: number[], dayCount: number } {
    let currentSequence: number[] = []
    let currentIndices: number[] = [];
    let dayCount: number = 1;
    for (let i = 0; i < this.array.length; i++) {
      if (this.array[i] < this.array[i + 1]) {
        currentSequence.push(this.array[i], this.array[i + 1]);
        currentIndices.push(i + 1, i + 2);
        dayCount++;
      }
    }
    const uniquecurrentSequenceSet = new Set(currentSequence);
    const uniqueArray = Array.from(uniquecurrentSequenceSet);

    const uniquuecurrentIndicesSet = new Set(currentIndices);
    const uniqueIndices = Array.from(uniquuecurrentIndicesSet);

    return { indices: uniqueIndices, sequence: uniqueArray, dayCount: dayCount };
  }
}

// Create an instance of DietApp
const dietApp = new DietApp();
document.getElementById('analyzeButton')?.addEventListener('click', dietApp.analyzeCalories);
document.getElementById('showSequenceButton')?.addEventListener('click', dietApp.showIncreasingSequence);
