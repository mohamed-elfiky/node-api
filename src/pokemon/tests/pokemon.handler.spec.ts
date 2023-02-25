import app from "../../app";
import * as httpRequest from "../../utils/httpRequest.util";
import { validResponseMock } from "./validResponse.mock";

jest.mock("module", () => ({ __esModule: true, default: jest.fn() }));

describe("pokemon module handler", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("should return status code 400 when name is empty", async () => {
    const request = await app.inject({
      url: "/poke/",
    });

    expect(request.statusCode).toEqual(400);
  });

  test("should return status code 404 when pokemon name is not found", async () => {
    jest.spyOn(httpRequest, "httpRequest").mockRejectedValue(new Error());

    const request = await app.inject({
      url: "/poke/adfs",
    });

    expect(request.statusCode).toEqual(404);
  });

  test("should return status code 200 when name found", async () => {
    jest
      .spyOn(httpRequest, "httpRequest")
      .mockResolvedValue(validResponseMock as any);

    const request = await app.inject({
      url: "/poke/bulbasaur",
    });

    expect(request.statusCode).toEqual(200);
  });
});
