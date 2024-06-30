# functions

Quick Reference:

Test ArcGIS suggest:

```bash
npm run shell
```

Then in the shell:

```
firebase > await arcGisSuggest({ qs:{ l:"yosemite" } })
```

Testing mocked functions:

 http function initialized (http://127.0.0.1:5001/dwmkerr-tripweather/us-central1/helloWorld).
 http function initialized (http://127.0.0.1:5001/dwmkerr-tripweather/us-central1/arcGisStatus).
 http function initialized (http://127.0.0.1:5001/dwmkerr-tripweather/us-central1/arcGisSuggest).
 http function initialized (http://127.0.0.1:5001/dwmkerr-tripweather/us-central1/findAddressFromSuggestion).
 http function initialized (http://127.0.0.1:5001/dwmkerr-tripweather/us-central1/reverseGeocode).

 ```
 echo -n '{"data": { "location": "blue mountains"} }' | http POST http://127.0.0.1:5001/dwmkerr-tripweather/us-central1/arcGisSuggest
```

