// backend/logic/reportsLogic.spec.js

const { getReports } = require('./reportsLogic');
// const { execute } = require('../utils/dal');

// Spy on the execute function from the dal module
const executeSpy = jest.spyOn(require('../utils/dal'), 'execute');

describe('getReports', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an array of ReportModel objects', async () => {
    // Prepare mock data
    const mockReports = [
      { destination: 'Hawaii', totalLikes: 10 },
      { destination: 'Bali', totalLikes: 15 },
    ];

    // Mock the implementation of execute to return mockReports
    executeSpy.mockImplementationOnce(async () => [mockReports]);

    // Call getReports function
    const result = await getReports();

    // Expect the result to be the mockReports
    expect(result).toEqual(mockReports);

    // Check if the execute function was called once
    expect(executeSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if something goes wrong', async () => {
    // Mock the implementation of execute to throw an error
    const errorMessage = 'Something went wrong';
    executeSpy.mockImplementationOnce(async () => {
      throw new Error(errorMessage);
    });

    // Call getReports function and expect it to throw an error
    try {
      await getReports();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(errorMessage);
    }

    // Check if the execute function was called once
    expect(executeSpy).toHaveBeenCalledTimes(1);
  });
});








