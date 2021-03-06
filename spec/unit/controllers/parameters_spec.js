describe("RAML.Controllers.Parameters", function() {
  var controller, scope;

  function createControllerForParameters(parsedApi) {
    scope = {};
    scope.resource = RAML.Inspector.create(parsedApi).resources[0];
    scope.method = scope.resource.methods[0];

    return new RAML.Controllers.Parameters(scope);
  }

  describe("when instantiated", function() {
    describe("with all available parameter types", function() {
      var raml = createRAML(
        'title: Example API',
        'baseUri: http://www.example.com',
        '/resource/{uriParam}:',
        '  post:',
        '    headers:',
        '      headerParam:',
        '    queryParameters:',
        '      queryParam:',
        '    body:',
        '      application/x-www-form-urlencoded:',
        '        formParameters:',
        '          normalFormParam:',
        '      multipart/form-data:',
        '        formParameters:',
        '          multipartFormParam:'
      );

      parseRAML(raml);

      beforeEach(function() {
        controller = createControllerForParameters(this.api);
      });

      it("adds Headers to parameterGroups on scope", function() {
        expect(scope.parameterGroups[0][0]).toEqual('Headers');
        expect(scope.parameterGroups[0][1]['headerParam']).toBeDefined();
      });

      it("adds URI Parameters to parameterGroups on scope", function() {
        expect(scope.parameterGroups[1][0]).toEqual('URI Parameters');
        expect(scope.parameterGroups[1][1]['uriParam']).toBeDefined();
      });

      it("adds Query Parameters to parameterGroups on scope", function() {
        expect(scope.parameterGroups[2][0]).toEqual('Query Parameters');
        expect(scope.parameterGroups[2][1]['queryParam']).toBeDefined();
      });

      it("adds single-part Form Parameters to parameterGroups on scope", function() {
        expect(scope.parameterGroups[3][0]).toEqual('Form Parameters');
        expect(scope.parameterGroups[3][1]['normalFormParam']).toBeDefined();
      });

      it("adds multi-part Form Parameters to parameterGroups on scope", function() {
        expect(scope.parameterGroups[4][0]).toEqual('Multipart Form Parameters');
        expect(scope.parameterGroups[4][1]['multipartFormParam']).toBeDefined();
      });
    });

    describe("with a few missing parameter types", function() {
      var raml = createRAML(
        'title: Example API',
        'baseUri: http://www.example.com',
        '/resource/{uriParam}:',
        '  post:',
        '    queryParameters:',
        '      queryParam:'
      );

      parseRAML(raml);

      beforeEach(function() {
        controller = createControllerForParameters(this.api);
      });

      it("sets the correct number of parameter groups on scope", function() {
        expect(scope.parameterGroups.length).toEqual(2);
      });

      it("adds URI Parameters to parameterGroups on scope", function() {
        expect(scope.parameterGroups[0][0]).toEqual('URI Parameters');
        expect(scope.parameterGroups[0][1]['uriParam']).toBeDefined();
      });

      it("adds Query Parameters to parameterGroups on scope", function() {
        expect(scope.parameterGroups[1][0]).toEqual('Query Parameters');
        expect(scope.parameterGroups[1][1]['queryParam']).toBeDefined();
      });
    });

    describe("with no parameters", function() {
      var raml = createRAML(
        'title: Example API',
        'baseUri: http://www.example.com',
        '/resource:',
        '  get:'
      );

      parseRAML(raml);

      beforeEach(function() {
        controller = createControllerForParameters(this.api);
      });

      it("sets an empty array of parameter groups on scope", function() {
        expect(scope.parameterGroups).toEqual([]);
      });
    });
  });
});
