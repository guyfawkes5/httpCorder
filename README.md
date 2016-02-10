# httpCorder

A proxy application that stores HTTP requests and responses in an attached MongoDB instance. Any subsequent HTTP requests that are identical to a previously stored request will get a stored match instead of a live response.

This server application may be useful in situations where you wish to have an intermediary cache for all HTTP resources that is capable of customisable behaviour, or you want an application that stores HTTP traffic in an easily queryable MongoDB form.

This project is currently under early development but should still work at a basic level (support for Last-Modified or ETag headers still has to be added).
