using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace HiDoctor
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
           name: "UpdateAssetThumbnailOfAssignedAsset",
           routeTemplate: "AutoSignOnApi/UpdateAssetThumbnailOfAssignedAsset/{subDomainName}/{companyId}/{daCode}/{userId}",
           defaults: new { controller = "AutoSignOnApi", action = "UpdateAssetThumbnailOfAssignedAsset" }
          );
            config.Routes.MapHttpRoute(
                  name: "AddNewCategory",
                  routeTemplate: "AutoSignOnApi/AddNewCategory/{subDomainName}/{companyCode}/{companyId}/{categoryName}/{loginUserId}/{loginUserCode}",
                  defaults: new { controller = "AutoSignOnApi", action = "AddNewCategory" }
                 );

            config.Routes.MapHttpRoute(
                     name: "GetAllActiveUsers",
                     routeTemplate: "AutoSignOnApi/GetAllActiveUsers/{subDomainName}/{companyId}/{userId}",
                     defaults: new { controller = "AutoSignOnApi", action = "GetAllActiveUsers" }
                     );

            config.Routes.MapHttpRoute(
                    name: "GetDistinctActiveUsers",
                    routeTemplate: "AutoSignOnApi/GetDistinctActiveUsers/{subDomainName}/{companyId}/{userId}",
                    defaults: new { controller = "AutoSignOnApi", action = "GetDistinctActiveUsers" }
                    );

            config.Routes.MapHttpRoute(
                    name: "GetDATagDetails",
                    routeTemplate: "AutoSignOnApi/GetDATagDetails/{subDomainName}/{daCode}/{companyCode}/{companyId}",
                    defaults: new { controller = "AutoSignOnApi", action = "GetDATagDetails" }
                    );

            config.Routes.MapHttpRoute(
                            name: "GetDateDisplayFormat",
                            routeTemplate: "AutoSignOnApi/GetDateDisplayFormat/{subdomainName}/{companyId}",
                            defaults: new { controller = "AutoSignOnApi", action = "GetDateDisplayFormat" }
                          );

            config.Routes.MapHttpRoute(
                    name: "UpdateAssetNameOfAssignedAssetForV38",
                    routeTemplate: "AutoSignOnApi/UpdateAssetNameOfAssignedAssetForV38/{subDomainName}/{companyId}/{userId}",
                    defaults: new { controller = "AutoSignOnApi", action = "UpdateAssetNameOfAssignedAssetForV38" }
                    );

            config.Routes.MapHttpRoute(
                        name: "UpdateAssetDescriptionOfAssignedAssetForV38",
                        routeTemplate: "AutoSignOnApi/UpdateAssetDescriptionOfAssignedAssetForV38/{subDomainName}/{companyId}/{userId}",
                        defaults: new { controller = "AutoSignOnApi", action = "UpdateAssetDescriptionOfAssignedAssetForV38" }
                        );

            config.Routes.MapHttpRoute(
                      name: "UpdateAssetCategoryOfAssignedAssetForV38",
                      routeTemplate: "AutoSignOnApi/UpdateAssetCategoryOfAssignedAssetForV38/{subDomainName}/{companyId}/{userId}",
                      defaults: new { controller = "AutoSignOnApi", action = "UpdateAssetCategoryOfAssignedAssetForV38" }
                      );

            config.Routes.MapHttpRoute(
                      name: "UpdateAssetTagsOfAssignedAssetForV38",
                      routeTemplate: "AutoSignOnApi/UpdateAssetTagsOfAssignedAssetForV38/{subDomainName}/{companyId}/{userId}/{userCode}/{companyCode}/{retainPrevTags}",
                      defaults: new { controller = "AutoSignOnApi", action = "UpdateAssetTagsOfAssignedAssetForV38" }
                      );

            config.Routes.MapHttpRoute(
                        name: "ChangeAssignedAssetFileForV38",
                        routeTemplate: "AutoSignOnApi/ChangeAssignedAssetFileForV38/{subDomainName}/{companyId}/{userId}/{daCode}/{offset}/{fileSize}",
                        defaults: new { controller = "AutoSignOnApi", action = "ChangeAssignedAssetFileForV38" }
                        );

            config.Routes.MapHttpRoute(
                       name: "RetireAssignedAssetsForV38",
                       routeTemplate: "AutoSignOnApi/RetireAssignedAssetsForV38/{subdomainName}/{companyId}/{LoginuserId}/{LoginUserCode}/{targetAssetIds}",
                       defaults: new { controller = "AutoSignOnApi", action = "RetireAssignedAssetsForV38" }
                       );
            config.Routes.MapHttpRoute(
       name: "GetAssignedAssetFilterCategoryForV39",
        routeTemplate: "AutoSignOnAssetApi/GetAssignedAssetFilterCategoryForV39/{subDomainName}/{companyId}/{loginUserId}/{versionNumber}",
        defaults: new { controller = "AutoSignOnAssetApi", action = "GetAssignedAssetFilterCategoryForV39" }
       );
            config.Routes.MapHttpRoute(
                       name: "GetAssignedAssetFilterFileExtensionForV39",
                        routeTemplate: "AutoSignOnAssetApi/GetAssignedAssetFilterFileExtensionForV39/{subDomainName}/{companyId}/{loginUserId}/{versionNumber}",
                        defaults: new { controller = "AutoSignOnAssetApi", action = "GetAssignedAssetFilterFileExtensionForV39" }
                       );
            config.Routes.MapHttpRoute(
                       name: "GetAssignedAssetFilterTagsForV39",
                        routeTemplate: "AutoSignOnAssetApi/GetAssignedAssetFilterTagsForV39/{subDomainName}/{companyId}/{loginUserId}/{versionNumber}",
                        defaults: new { controller = "AutoSignOnAssetApi", action = "GetAssignedAssetFilterTagsForV39" }
                       );
            config.Routes.MapHttpRoute(
                      name: "GetAssignedAssetFilterUsersForV39",
                       routeTemplate: "AutoSignOnAssetApi/GetAssignedAssetFilterUsersForV39/{subDomainName}/{companyId}/{loginUserId}/{versionNumber}",
                       defaults: new { controller = "AutoSignOnAssetApi", action = "GetAssignedAssetFilterUsersForV39" }
                      );
            config.Routes.MapHttpRoute(
                   name: "GetAssignedAssetPagingDetailsFor39",
                    routeTemplate: "AutoSignOnAssetApi/GetAssignedAssetPagingDetailsFor39/{subDomainName}/{companyId}/{loginUserId}/{pageSize}/{versionNumber}",
                    defaults: new { controller = "AutoSignOnAssetApi", action = "GetAssignedAssetPagingDetailsFor39" }
                   );

            config.Routes.MapHttpRoute(
                     name: "GetAssignedAssetsWithPagingForV39",
                      routeTemplate: "AutoSignOnAssetApi/GetAssignedAssetsWithPagingForV39/{subDomainName}/{companyId}/{loginUserId}/{pageNumber}/{pageSize}/{orderByColumnName}/{orderBy}/{offset}/{versionNumber}",
                      defaults: new { controller = "AutoSignOnAssetApi", action = "GetAssignedAssetsWithPagingForV39" }
                     );
            config.Routes.MapHttpRoute(
                   name: "GetAssignedAssetsGroupCount",
                    routeTemplate: "AutoSignOnAssetApi/GetAssignedAssetsGroupCount/{subDomainName}/{companyId}/{loginUserId}/{loginUserCode}",
                    defaults: new { controller = "AutoSignOnAssetApi", action = "GetAssignedAssetsGroupCount" }
                   );
            config.Routes.MapHttpRoute(
                   name: "UploadAsset",
                    routeTemplate: "AutoSignOnAssetApi/UploadAsset/{subDomainName}/{companyId}/{loginUserId}/{uploadSource}/{assetFileSize}/{versionNumber}",
                    defaults: new { controller = "AutoSignOnAssetApi", action = "UploadAsset" }
                   );
            config.Routes.MapHttpRoute(
                   name: "GetAssetDetailsByTargetAssetIds",
                    routeTemplate: "AutoSignOnAssetApi/GetAssetDetailsByTargetAssetIds/{subDomainName}/{companyId}/{loginUserId}/{utcOffset}/{versionNumber}",
                    defaults: new { controller = "AutoSignOnAssetApi", action = "GetAssetDetailsByTargetAssetIds" }
                   );
            config.Routes.MapHttpRoute(
                  name: "GetUsersMappedToAssetsByAssetIdWithPagingForV39",
                   routeTemplate: "AutoSignOnAssetApi/GetUsersMappedToAssetsByAssetIdWithPagingForV39/{subDomainName}/{companyId}/{daCode}/{pageNumber}/{pageSize}/{searchText}",
                   defaults: new { controller = "AutoSignOnAssetApi", action = "GetUsersMappedToAssetsByAssetIdWithPagingForV39" });
            config.Routes.MapHttpRoute(
                          name: "UpdateAssignedAssetPropertiesForV39",
                          routeTemplate: "AutoSignOnAssetApi/UpdateAssignedAssetPropertiesForV39/{subDomainName}/{companyId}/{userId}/{retainPrevTags}/{userCode}/{companyCode}",
                          defaults: new { controller = "AutoSignOnAssetApi", action = "UpdateAssignedAssetPropertiesForV39" }
                      );
            config.Routes.MapHttpRoute(
                       name: "GetAssetCategories",
                       routeTemplate: "AutoSignOnAssetApi/GetAssetCategories/{subDomainName}/{companyCode}/{companyId}",
                       defaults: new { controller = "AutoSignOnAssetApi", action = "GetAssetCategories" }
                   );
            config.Routes.MapHttpRoute(
                      name: "GetAssetTags",
                      routeTemplate: "AutoSignOnAssetApi/GetAssetTags/{subDomainName}/{companyCode}/{companyId}",
                      defaults: new { controller = "AutoSignOnAssetApi", action = "GetAssetTags" }
                  );
            config.Routes.MapHttpRoute(
                    name: "GetCustomerKangleModuleAccess",
                    routeTemplate: "AutoSignOnAssetApi/GetCustomerKangleModuleAccess/{subDomainName}/{companyId}/{userId}/{screenName}",
                    defaults: new { controller = "AutoSignOnAssetApi", action = "GetCustomerKangleModuleAccess" }
                    );
            config.Routes.MapHttpRoute(
                      name: "GetLandingPageAccess",
                      routeTemplate: "AutoSignOnAssetApi/GetLandingPageAccess/{subDomainName}/{companyId}/{userId}",
                      defaults: new { controller = "AutoSignOnAssetApi", action = "GetLandingPageAccess" }
                      );
            config.Routes.MapHttpRoute(
               name: "GetAvailableCourses",
               routeTemplate: "AdCourseApi/GetAvailableCourses/{subdomainName}/{companyId}/{userId}/{utcOffset}",
               defaults: new { controller = "AdCourseApi", action = "GetAvailableCourses" }
            );

            config.Routes.MapHttpRoute(
               name: "GetSectionDetailsOfCourse",
               routeTemplate: "AdCourseApi/GetSectionDetailsOfCourse/{subdomainName}/{companyId}/{userId}/{courseId}/{publishId}",
               defaults: new { controller = "AdCourseApi", action = "GetSectionDetailsOfCourse" }
            );
            config.Routes.MapHttpRoute(
                name: "GetAdAssetsByCourseId",
                routeTemplate: "AdCourseApi/GetAdAssetsByCourseId/{subdomainName}/{companyId}/{courseId}/{sectionId}",
                defaults: new { controller = "AdCourseApi", action = "GetAdAssetsByCourseId" }
            );

            config.Routes.MapHttpRoute(
                name: "InsertAdCourseViewAnalytics",
                routeTemplate: "AdCourseApi/InsertAdCourseViewAnalytics/{subdomainName}",
                defaults: new { controller = "AdCourseApi", action = "InsertAdCourseViewAnalytics" }
            );

            config.Routes.MapHttpRoute(
               name: "GetAdCourseCertificate",
               routeTemplate: "AdCourseApi/GetAdCourseCertificate/{subdomainName}/{companyId}/{courseUserAssignmentId}/{utcOffset}",
               defaults: new { controller = "AdCourseApi", action = "GetAdCourseCertificate" }       
            );

            #region TestPage
            config.Routes.MapHttpRoute(
                name: "getAdQuestionAnswerDetails",
                routeTemplate: "AdCourseApi/getAdQuestionAnswerDetails/{subdomainName}/{companyId}/{userId}/{courseId}/{sectionId}/{publishId}",
                defaults: new { controller = "AdCourseApi", action = "getAdQuestionAnswerDetails" }
            );

            config.Routes.MapHttpRoute(
               name: "insertAdCourseResponse",
               routeTemplate: "AdCourseApi/insertAdCourseResponse/{subdomainName}/{companyId}/{userId}",
               defaults: new { controller = "AdCourseApi", action = "insertAdCourseResponse" }
            );
            config.Routes.MapHttpRoute(
              name: "getAdSectionReportHeader",
              routeTemplate: "AdCourseApi/getAdSectionReportHeader/{subdomainName}/{courseId}/{userId}/{publishId}",
              defaults: new { controller = "AdCourseApi", action = "getAdSectionReportHeader" }
            );
            config.Routes.MapHttpRoute(
             name: "getAdSectionAttemptDetails",
             routeTemplate: "AdCourseApi/getAdSectionAttemptDetails/{subdomainName}/{companyId}/{courseId}/{userId}/{publishId}/{sectionId}/{offSet}",
             defaults: new { controller = "AdCourseApi", action = "getAdSectionAttemptDetails" }
            );
            config.Routes.MapHttpRoute(
                name: "getAdCourseQuestionAnswerDetails",
                routeTemplate: "AdCourseApi/getAdCourseQuestionAnswerDetails/{subdomainName}/{companyId}/{userId}/{courseId}/{sectionId}/{publishId}",
                defaults: new { controller = "AdCourseApi", action = "getAdCourseQuestionAnswerDetails" }
           );
            config.Routes.MapHttpRoute(
             name: "GetAdSectionQuestionDetails",
             routeTemplate: "AdCourseApi/GetAdSectionQuestionDetails/{subdomainName}/{courseSectionUserExamId}/{utcOffset}/{companyId}",
             defaults: new { controller = "AdCourseApi", action = "GetAdSectionQuestionDetails" }
            );
            config.Routes.MapHttpRoute(
                name: "insertAdCourseSectionUserExamHeader",
                routeTemplate: "AdCourseApi/insertAdCourseSectionUserExamHeader/{subdomainName}/{courseId}/{courseUserAssignMentId}/{couseUserSectionId}/{publishId}/{userId}/{companyId}/{sectionId}",
                defaults: new { controller = "AdCourseApi", action = "insertAdCourseSectionUserExamHeader" }
           );
            config.Routes.MapHttpRoute(
                  name: "insertCourseUserExam",
                  routeTemplate: "AdCourseApi/insertCourseUserExam/{subdomainName}",
                  defaults: new { controller = "AdCourseApi", action = "insertCourseUserExam" }
             );
            #endregion

            #region Asset Image
            config.Routes.MapHttpRoute(
                 name: "getAssetImages",
                 routeTemplate: "AdCourseApi/getAssetImages/{subdomainName}/{companyId}",
                 defaults: new { controller = "AdCourseApi", action = "getAssetImages" }
             );
            #endregion Asset Image
        }
    }
}
