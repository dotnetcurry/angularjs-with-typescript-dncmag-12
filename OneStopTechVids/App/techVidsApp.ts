/// <reference path="../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../scripts/typings/angularjs/angular-route.d.ts" />

module Extensions {
    export class Video {
        id: number;
        title: string;
        description: string;
        author: string;
        rating: number;
        category: number;
    }

    export class Category {
        id: number;
        name: string;
    }

    export interface ITechVidsScope extends ng.IScope {
        videos: Array<Video>;
        upRate(id: number, rating: number): void;
        downRate(id: number, rating: number): void;
    }

    export interface ITechVidEditScope extends ng.IScope {
        video: Video;
        category: Category;
        categories: Array<Category>;
        name: RegExp;
        techVidForm: ng.IFormController;

        editVideo();
        deleteVideo(id: number);
    }

    export interface ITechVidsRouteParams extends ng.route.IRouteParamsService {
        id: string;
    }

    export interface ITechVidsCategoryScope extends ng.IScope {
        categories: Array<Category>;
    }

    export interface IAddTechVidScope extends ng.IScope {
        video: Video;
        name: RegExp;
        categories: Array<Category>;
        category: Category;
        addVideo(): void;
        cancelVideo(): void;
        techVidForm: ng.IFormController;
    }
}

module OneStopTechVidsApp {
    export class Config {
        constructor($routeProvider: ng.route.IRouteProvider) {
            $routeProvider.when("/list", { templateUrl: "App/Templates/VideoList.html", controller: "TechVidsListCtrl" })
                .when("/list/:id", { templateUrl: "App/Templates/VideoList.html", controller: "TechVidsListCtrl" })
                .when("/add", { templateUrl: "App/Templates/AddVideo.html", controller: "AddTechVideoCtrl" })
                .when("/edit/:id", { templateUrl: "App/Templates/EditVideo.html", controller: "EditTechVideoCtrl" })
                .otherwise({ redirectTo: '/list' });
        }
    }
    Config.$inject = ['$routeProvider'];

    export class TechVidsDataSvc {
        private videos: Array<Extensions.Video>;
        private categories: Array<Extensions.Category>;
        private techVidsApiPath: string;
        private categoriesApiPath: string;
        private httpService: ng.IHttpService;
        private qService: ng.IQService;

        getAllVideos(fetchFromService?: boolean): ng.IPromise<any> {
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

            function getVideosFromService() : ng.IPromise<any> {
                var deferred = self.qService.defer();

                self.httpService.get(self.techVidsApiPath).then(function (result: any) {
                    self.videos = result.data;
                    deferred.resolve(self.videos);
                }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }
        }

        checkIfVideoExists(title: string): ng.IPromise<any> {
            var self = this;

            var deferred = self.qService.defer();

            self.httpService.get(self.techVidsApiPath + "?title=" + title)
                .then(function (result) {
                    deferred.resolve(result.data);
                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        getVideosByCategory(id: number): ng.IPromise<any> {
            var self = this;

            var filteredVideos: Array<Extensions.Video> = [];

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
        }

        getVideo(id: number): ng.IPromise<any> {
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
        }

        getAllCategories(): ng.IPromise<any> {
            var self = this;

            if (self.categories !== undefined) {
                return self.qService.when(this.categories);
            } else {
                var deferred = self.qService.defer();

                self.httpService.get(self.categoriesApiPath).then(function (result: any) {
                    self.categories = result.data;
                    deferred.resolve(self.categories);
                }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }
        }

        getCategory(id: number): ng.IPromise<any> {
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

        }

        updateVideo(video: Extensions.Video):ng.IPromise<any> {
            var self = this;
            var deferred = self.qService.defer();

            self.httpService.put(self.techVidsApiPath + "/" + video.id, video)
                .then(function (data) {
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
        }

        addVideo(video: Extensions.Video): ng.IPromise<any> {
            var self = this;
            var deferred = self.qService.defer();

            self.httpService.post(self.techVidsApiPath, video)
                .then(function (result) {
                    video.id = result.data.id;
                    self.videos.push(video);
                    deferred.resolve();
                }, function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        }

        deleteVideo(id: number): ng.IPromise<any> {
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
        }

        setRating(id: number, rating: number):ng.IPromise<any> {
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
        }

        constructor($http: ng.IHttpService, $q: ng.IQService) {
            this.techVidsApiPath = "api/techVideos";
            this.categoriesApiPath = "api/categories";

            this.httpService = $http;
            this.qService = $q;
        }

        public static TechVidsDataSvcFactory($http: ng.IHttpService, $q: ng.IQService): TechVidsDataSvc {
            return new TechVidsDataSvc($http, $q);
        }

    }

    export class TechVidsCategoryCtrl {
        private $scope: Extensions.ITechVidsCategoryScope;
        private dataSvc: TechVidsDataSvc;

        private init(): void {
            var self = this;

            self.dataSvc.getAllCategories().then(function (data) {
                self.$scope.categories = data;
            });
        }

        constructor($scope: Extensions.ITechVidsCategoryScope, techVidsDataSvc: TechVidsDataSvc) {
            this.$scope = $scope;
            this.dataSvc = techVidsDataSvc;

            this.init();
        }
    }
    TechVidsCategoryCtrl.$inject = ['$scope', 'techVidsDataSvc'];

    export class TechVidsListCtrl {
        private $scope: Extensions.ITechVidsScope;
        private $routeParams: Extensions.ITechVidsRouteParams;
        private dataSvc: TechVidsDataSvc;

        private init(): void {
            var self = this;
            
            //Fetching all videos if id is not found in route path
            if (self.$routeParams.id !== undefined) {
                self.dataSvc.getVideosByCategory(parseInt(this.$routeParams.id))
                    .then(function (data) {
                        self.$scope.videos = data;
                    });
            }
            //Fetching videos specific to category if id is found in route path
            else {
                self.dataSvc.getAllVideos().then(function (data) {
                    self.$scope.videos = data;
                });
            }
        }

        constructor($scope: Extensions.ITechVidsScope, $routeParams: Extensions.ITechVidsRouteParams, dataSvc: TechVidsDataSvc) {
            var self = this;

            self.$scope = $scope;
            self.$routeParams = $routeParams;
            self.dataSvc = dataSvc;

            self.$scope.upRate = function (id: number, rating: number) {
                self.dataSvc.setRating(id, rating+1).then(function () {
                    self.init();
                });
            };

            self.$scope.downRate = function (id: number, rating: number) {
                self.dataSvc.setRating(id, rating - 1).then(function () {
                    self.init();
                });
            };

            self.init();
        }
    }
    TechVidsListCtrl.$inject = ['$scope', '$routeParams', 'techVidsDataSvc'];

    export class EditTechVideoCtrl {
        private $scope: Extensions.ITechVidEditScope;
        private dataSvc: TechVidsDataSvc;
        private $routeParams: Extensions.ITechVidsRouteParams;

        private init(): void {
            var self = this;

            self.$scope.name = /^[a-zA-Z ]*$/;
            self.dataSvc.getVideo(parseInt(this.$routeParams.id)).then(function (data) {
                self.$scope.video = data;
                self.dataSvc.getCategory(self.$scope.video.category)
                    .then(function (result) {
                        self.$scope.category = result;
                    });
            });

            self.dataSvc.getAllCategories().then(function (data) {
                self.$scope.categories = data;
            });
        }

        constructor($scope: Extensions.ITechVidEditScope, $routeParams: Extensions.ITechVidsRouteParams, $window: ng.IWindowService, dataSvc: TechVidsDataSvc) {
            var self = this;

            self.$scope = $scope;
            self.$routeParams = $routeParams;
            self.dataSvc = dataSvc;

            self.$scope.editVideo = function () {
                self.$scope.video.category = self.$scope.category.id;
                dataSvc.updateVideo(self.$scope.video).then(function(parameters) {
                    self.$scope.techVidForm.$setPristine();
                    $window.location.href = "#/list/" + self.$scope.video.category;
                });
            };

            self.$scope.deleteVideo = function () {
                dataSvc.deleteVideo(self.$scope.video.id).then(function() {
                    self.$scope.techVidForm.$setPristine();
                    $window.location.href = "#/list/" + self.$scope.video.category;    
                });
                
            };

            self.init();
        }
    }
    EditTechVideoCtrl.$inject = ['$scope', '$routeParams', '$window', 'techVidsDataSvc'];

    export class AddVideoCtrl {
        $scope: Extensions.IAddTechVidScope;
        $window: ng.IWindowService;
        dataSvc: TechVidsDataSvc;

        constructor($scope: Extensions.IAddTechVidScope, $window: ng.IWindowService, dataSvc: TechVidsDataSvc) {
            var self = this;

            self.$scope = $scope;
            self.$window = $window;
            self.dataSvc = dataSvc;

            self.$scope.name = /^[a-zA-Z ]*$/;

            self.$scope.addVideo = function () {
                self.$scope.video.rating = 4;
                self.$scope.video.category = self.$scope.category.id;
                dataSvc.addVideo(self.$scope.video).then(function() {
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

        private init(): void {
            var self = this;

            self.dataSvc.getAllCategories().then(function (data) {
                self.$scope.categories = data;
            });
        }
    }
    AddVideoCtrl.$inject = ['$scope', '$window', 'techVidsDataSvc'];

    export class UniqueVideoTitle {
        public static UniqueVideoTitleDirective(dataSvc: TechVidsDataSvc): ng.IDirective {
            return {
                require: 'ngModel',
                link: function (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: ng.INgModelController) {
                    element.bind('blur', function() {
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
        }
    }

    var app = angular.module("techVidsApp", ['ngRoute']);
    app.config(Config);
    app.factory('techVidsDataSvc', ['$http', '$q', TechVidsDataSvc.TechVidsDataSvcFactory]);
    app.controller('TechVidsListCtrl', TechVidsListCtrl);
    app.controller('TechVidsCategoryCtrl', TechVidsCategoryCtrl);
    app.controller('EditTechVideoCtrl', EditTechVideoCtrl);
    app.controller('AddTechVideoCtrl', AddVideoCtrl);
    app.directive('uniqueVideoTitle', ['techVidsDataSvc', UniqueVideoTitle.UniqueVideoTitleDirective]);
}