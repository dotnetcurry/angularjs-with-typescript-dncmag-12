/// <reference path="../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../scripts/typings/angularjs/angular-route.d.ts" />
var Extensions;
(function (Extensions) {
    var Video = (function () {
        function Video() {
        }
        return Video;
    })();
    Extensions.Video = Video;

    var Category = (function () {
        function Category() {
        }
        return Category;
    })();
    Extensions.Category = Category;
})(Extensions || (Extensions = {}));

var OneStopTechVidsApp;
(function (OneStopTechVidsApp) {
    var Config = (function () {
        function Config($routeProvider) {
            $routeProvider.when("/list", { templateUrl: "App/Templates/VideoList.html", controller: "TechVidsListCtrl" }).when("/list/:id", { templateUrl: "App/Templates/VideoList.html", controller: "TechVidsListCtrl" }).when("/add", { templateUrl: "App/Templates/AddVideo.html", controller: "AddTechVideoCtrl" }).when("/edit/:id", { templateUrl: "App/Templates/EditVideo.html", controller: "EditTechVideoCtrl" }).otherwise({ redirectTo: '/list' });
        }
        return Config;
    })();
    OneStopTechVidsApp.Config = Config;
    Config.$inject = ['$routeProvider'];

    var TechVidsDataSvc = (function () {
        function TechVidsDataSvc($http, $q) {
            this.techVidsApiPath = "api/techVideos";
            this.categoriesApiPath = "api/categories";

            this.httpService = $http;
            this.qService = $q;
        }
        TechVidsDataSvc.prototype.getAllVideos = function (fetchFromService) {
            var self = this;

            if (fetchFromService) {
                return getVideosFromService();
            } else {
                if (self.videos !== undefined) {
                    return self.qService.when(self.videos);
                } else {
                    return getVideosFromService();
                }
            }

            function getVideosFromService() {
                var deferred = self.qService.defer();

                self.httpService.get(self.techVidsApiPath).then(function (result) {
                    self.videos = result.data;
                    deferred.resolve(self.videos);
                }, function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            }
        };

        TechVidsDataSvc.prototype.checkIfVideoExists = function (title) {
            var self = this;

            var deferred = self.qService.defer();

            self.httpService.get(self.techVidsApiPath + "?title=" + title).then(function (result) {
                deferred.resolve(result.data);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        TechVidsDataSvc.prototype.getVideosByCategory = function (id) {
            var self = this;

            var filteredVideos = [];

            if (self.videos !== undefined) {
                return self.qService.when(filterVideos());
            } else {
                var deferred = self.qService.defer();
                self.getAllVideos().then(function (data) {
                    deferred.resolve(filterVideos());
                }, function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            }

            function filterVideos() {
                for (var counter = 0; counter < self.videos.length; counter++) {
                    if (self.videos[counter].category === id) {
                        filteredVideos.push(self.videos[counter]);
                    }
                }

                return filteredVideos;
            }
        };

        TechVidsDataSvc.prototype.getVideo = function (id) {
            var self = this;

            if (self.videos !== undefined) {
                return self.qService.when(filterVideo());
            } else {
                var deferred = self.qService.defer();

                self.getAllVideos().then(function (data) {
                    deferred.resolve(filterVideo());
                }, function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            }

            function filterVideo() {
                for (var counter = 0; counter < self.videos.length; counter++) {
                    if (id === self.videos[counter].id) {
                        return self.videos[counter];
                    }
                }

                return null;
            }
        };

        TechVidsDataSvc.prototype.getAllCategories = function () {
            var self = this;

            if (self.categories !== undefined) {
                return self.qService.when(this.categories);
            } else {
                var deferred = self.qService.defer();

                self.httpService.get(self.categoriesApiPath).then(function (result) {
                    self.categories = result.data;
                    deferred.resolve(self.categories);
                }, function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            }
        };

        TechVidsDataSvc.prototype.getCategory = function (id) {
            var self = this;

            if (self.categories !== undefined) {
                return self.qService.when(filterCategory());
            } else {
                var deferred = self.qService.defer();

                self.getAllCategories().then(function (data) {
                    deferred.resolve(filterCategory());
                }, function (error) {
                    deferred.reject(error);
                });

                return deferred.promise;
            }

            function filterCategory() {
                for (var counter = 0; counter < self.categories.length; counter++) {
                    if (self.categories[counter].id === id) {
                        return self.categories[counter];
                    }
                }
                return null;
            }
        };

        TechVidsDataSvc.prototype.updateVideo = function (video) {
            var self = this;
            var deferred = self.qService.defer();

            self.httpService.put(self.techVidsApiPath + "/" + video.id, video).then(function (data) {
                for (var counter = 0; counter < self.videos.length; counter++) {
                    if (self.videos[counter].id === video.id) {
                        self.videos[counter] = video;
                        break;
                    }
                }
                deferred.resolve();
            }, function (error) {
                deferred.reject();
            });

            return deferred.promise;
        };

        TechVidsDataSvc.prototype.addVideo = function (video) {
            var self = this;
            var deferred = self.qService.defer();

            self.httpService.post(self.techVidsApiPath, video).then(function (result) {
                video.id = result.data.id;
                self.videos.push(video);
                deferred.resolve();
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        TechVidsDataSvc.prototype.deleteVideo = function (id) {
            var self = this;
            var deferred = self.qService.defer();

            self.httpService.delete(self.techVidsApiPath + "/" + id).then(function (result) {
                for (var counter = 0; counter < self.videos.length; counter++) {
                    if (self.videos[counter].id === id) {
                        self.videos.splice(counter, 1);
                        break;
                    }
                }
                deferred.resolve();
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        TechVidsDataSvc.prototype.setRating = function (id, rating) {
            var self = this;
            var deferred = self.qService.defer();

            self.httpService({
                method: "patch",
                url: self.techVidsApiPath + "/" + id,
                data: { id: id, rating: rating }
            }).then(function (result) {
                for (var counter = 0; counter < self.videos.length; counter++) {
                    if (self.videos[counter].id === id) {
                        self.videos[counter].rating = rating;
                        break;
                    }
                }
                deferred.resolve();
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        TechVidsDataSvc.TechVidsDataSvcFactory = function ($http, $q) {
            return new TechVidsDataSvc($http, $q);
        };
        return TechVidsDataSvc;
    })();
    OneStopTechVidsApp.TechVidsDataSvc = TechVidsDataSvc;

    var TechVidsCategoryCtrl = (function () {
        function TechVidsCategoryCtrl($scope, techVidsDataSvc) {
            this.$scope = $scope;
            this.dataSvc = techVidsDataSvc;

            this.init();
        }
        TechVidsCategoryCtrl.prototype.init = function () {
            var self = this;

            self.dataSvc.getAllCategories().then(function (data) {
                self.$scope.categories = data;
            });
        };
        return TechVidsCategoryCtrl;
    })();
    OneStopTechVidsApp.TechVidsCategoryCtrl = TechVidsCategoryCtrl;
    TechVidsCategoryCtrl.$inject = ['$scope', 'techVidsDataSvc'];

    var TechVidsListCtrl = (function () {
        function TechVidsListCtrl($scope, $routeParams, dataSvc) {
            var self = this;

            self.$scope = $scope;
            self.$routeParams = $routeParams;
            self.dataSvc = dataSvc;

            self.$scope.upRate = function (id, rating) {
                self.dataSvc.setRating(id, rating + 1).then(function () {
                    self.init();
                });
            };

            self.$scope.downRate = function (id, rating) {
                self.dataSvc.setRating(id, rating - 1).then(function () {
                    self.init();
                });
            };

            self.init();
        }
        TechVidsListCtrl.prototype.init = function () {
            var self = this;

            //Fetching all videos if id is not found in route path
            if (self.$routeParams.id !== undefined) {
                self.dataSvc.getVideosByCategory(parseInt(this.$routeParams.id)).then(function (data) {
                    self.$scope.videos = data;
                });
            } else {
                self.dataSvc.getAllVideos().then(function (data) {
                    self.$scope.videos = data;
                });
            }
        };
        return TechVidsListCtrl;
    })();
    OneStopTechVidsApp.TechVidsListCtrl = TechVidsListCtrl;
    TechVidsListCtrl.$inject = ['$scope', '$routeParams', 'techVidsDataSvc'];

    var EditTechVideoCtrl = (function () {
        function EditTechVideoCtrl($scope, $routeParams, $window, dataSvc) {
            var self = this;

            self.$scope = $scope;
            self.$routeParams = $routeParams;
            self.dataSvc = dataSvc;

            self.$scope.editVideo = function () {
                self.$scope.video.category = self.$scope.category.id;
                dataSvc.updateVideo(self.$scope.video).then(function (parameters) {
                    self.$scope.techVidForm.$setPristine();
                    $window.location.href = "#/list/" + self.$scope.video.category;
                });
            };

            self.$scope.deleteVideo = function () {
                dataSvc.deleteVideo(self.$scope.video.id).then(function () {
                    self.$scope.techVidForm.$setPristine();
                    $window.location.href = "#/list/" + self.$scope.video.category;
                });
            };

            self.init();
        }
        EditTechVideoCtrl.prototype.init = function () {
            var self = this;

            self.$scope.name = /^[a-zA-Z ]*$/;
            self.dataSvc.getVideo(parseInt(this.$routeParams.id)).then(function (data) {
                self.$scope.video = data;
                self.dataSvc.getCategory(self.$scope.video.category).then(function (result) {
                    self.$scope.category = result;
                });
            });

            self.dataSvc.getAllCategories().then(function (data) {
                self.$scope.categories = data;
            });
        };
        return EditTechVideoCtrl;
    })();
    OneStopTechVidsApp.EditTechVideoCtrl = EditTechVideoCtrl;
    EditTechVideoCtrl.$inject = ['$scope', '$routeParams', '$window', 'techVidsDataSvc'];

    var AddVideoCtrl = (function () {
        function AddVideoCtrl($scope, $window, dataSvc) {
            var self = this;

            self.$scope = $scope;
            self.$window = $window;
            self.dataSvc = dataSvc;

            self.$scope.name = /^[a-zA-Z ]*$/;

            self.$scope.addVideo = function () {
                self.$scope.video.rating = 4;
                self.$scope.video.category = self.$scope.category.id;
                dataSvc.addVideo(self.$scope.video).then(function () {
                    var category = self.$scope.video.category;

                    self.$scope.video = { id: 0, title: "", description: "", category: 0, author: "", rating: 0 };
                    self.$scope.techVidForm.$setPristine();
                    self.$window.location.href = "#/list/" + category;
                });
            };

            self.$scope.cancelVideo = function () {
                self.$scope.video = new Extensions.Video();
                self.$scope.category = null;
                self.$scope.techVidForm.$setPristine();
            };

            self.init();
        }
        AddVideoCtrl.prototype.init = function () {
            var self = this;

            self.dataSvc.getAllCategories().then(function (data) {
                self.$scope.categories = data;
            });
        };
        return AddVideoCtrl;
    })();
    OneStopTechVidsApp.AddVideoCtrl = AddVideoCtrl;
    AddVideoCtrl.$inject = ['$scope', '$window', 'techVidsDataSvc'];

    var UniqueVideoTitle = (function () {
        function UniqueVideoTitle() {
        }
        UniqueVideoTitle.UniqueVideoTitleDirective = function (dataSvc) {
            return {
                require: 'ngModel',
                link: function (scope, element, attrs, ctrl) {
                    element.bind('blur', function () {
                        var viewValue = element.val();
                        dataSvc.checkIfVideoExists(viewValue).then(function (result) {
                            if (result === "true") {
                                ctrl.$setValidity("uniqueVideoTitle", true);
                            } else {
                                ctrl.$setValidity("uniqueVideoTitle", false);
                            }
                        }, function (error) {
                            ctrl.$setValidity("uniqueVideoTitle", false);
                        });
                    });
                }
            };
        };
        return UniqueVideoTitle;
    })();
    OneStopTechVidsApp.UniqueVideoTitle = UniqueVideoTitle;

    var app = angular.module("techVidsApp", ['ngRoute']);
    app.config(Config);
    app.factory('techVidsDataSvc', ['$http', '$q', TechVidsDataSvc.TechVidsDataSvcFactory]);
    app.controller('TechVidsListCtrl', TechVidsListCtrl);
    app.controller('TechVidsCategoryCtrl', TechVidsCategoryCtrl);
    app.controller('EditTechVideoCtrl', EditTechVideoCtrl);
    app.controller('AddTechVideoCtrl', AddVideoCtrl);
    app.directive('uniqueVideoTitle', ['techVidsDataSvc', UniqueVideoTitle.UniqueVideoTitleDirective]);
})(OneStopTechVidsApp || (OneStopTechVidsApp = {}));
//# sourceMappingURL=techVidsApp.js.map
