<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait GeneratesApiResponses
{
    // public interface
    public function passThrough($responseBody)
    {
        return $this->respond(json_decode($responseBody), $httpStatusCode = 200);
    }

    public function respondOK($data)
    {
        return $this->success($data);
    }

    public function respondCreated($data)
    {
        return $this->success($data, 201);
    }

    public function respondNoContent()
    {
        return $this->success([], 204);
    }

    public function respondForbidden()
    {
        return $this->error([], 403);
    }

    public function respondNotFound()
    {
        return $this->error([], 404);
    }

    public function respondWithValidationErrors(Array $errors)
    {
        return $this->error($errors);
    }

    // non-public methods
    private function success($data = null, $httpStatusCode = 200)
    {
        $body = [];

        if ($data) {
            $body['data'] = $data;
        }

        return $this->respond($body, $httpStatusCode);
    }

    private function error($errors = null, $httpStatusCode = 422)
    {
        $body = [];

        if ($errors) {
            $body['errors'] = $errors;
        }

        return $this->respond($body, $httpStatusCode);
    }

    private function respond($body = null, $httpStatusCode = 200)
    {
        $response = new JsonResponse($body);
        $response->setStatusCode($httpStatusCode);

        return $response;
    }
}
