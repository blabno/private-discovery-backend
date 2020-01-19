# Private Discovery

Discover and share content with your privacy in mind. Own your data.

## Development

Install dependencies:

    docker-compose run app yarn

Install new dependency (i.e. lodash) :

    docker-compose run app yarn add lodash -E
    
Start the app in live reload mode:

    docker-compose up

Seed sample data:

    docker-compose run app yarn seed
    
In case of seed failure:

    docker-compose down
    docker-compose up

Run static analysis:

    docker-compose run app yarn lint --fix
    
Start HTTP server to host static files:

    npm run serve
    
    curl http://localhost:5000/sample/rss/toshi-times.xml
    
