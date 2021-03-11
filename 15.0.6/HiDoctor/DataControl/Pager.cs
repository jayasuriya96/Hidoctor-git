#region Usings
using System;
using System.Text;
#endregion Usings

namespace DataControl
{
    public class Pager
    {
        /// <summary>
        /// Set the paging format to the Grid.
        /// </summary>
        /// <param name="pageNumber"></param>
        /// <param name="totalPageCount"></param>
        /// <returns></returns>
        public static StringBuilder Paging(int pageNumber, int totalPageCount)
        {
            StringBuilder strBuilder = new StringBuilder();
            // if page count > 1 we enable paging.
            if (totalPageCount > 1)
            {
                // Start: Drop Down design
                StringBuilder strCmbBuilder = new StringBuilder();
                strCmbBuilder.Append("<select id='drpPaging' onchange='fnGoToPage()' style='margin-top:-8px;'>");
                for (int index = 1; index <= totalPageCount; index++)
                {
                    if (pageNumber == index)
                    {
                        strCmbBuilder.Append("<option selected value=" + index.ToString() + ">");
                    }
                    else
                    {
                        strCmbBuilder.Append("<option value=" + index.ToString() + ">");
                    }
                    strCmbBuilder.Append(index.ToString());
                    strCmbBuilder.Append("</option>");
                }
                   strCmbBuilder.Append("</select>");
                // End: Drop Down design

                // page number ==1 we disable the "Previous" button link.
                if (pageNumber == 1)
                {
                    strBuilder.Append("<div class='pgcont'><div style='float:left'>Pages: &nbsp;</div><div id='spnprev' ></div><div style='float:left;'><label>&nbsp;<span id='pageno'>" + pageNumber + "</span> Of " + totalPageCount.ToString() + "&nbsp;</label></div><div id='spnnxt' class='pagenav' onclick='fnGoToNextPage()'></div>&nbsp;" + strCmbBuilder.ToString() + "</div>");
                }
                else
                {
                    // page number reach the page count, we disable the "Next" button link.
                    if (totalPageCount == pageNumber)
                    {
                        strBuilder.Append("<div class='pgcont'><div style='float:left'>Pages: &nbsp;</div><div id='spnprev' class='pagenav' onclick='fnGoToPrevPage()'></div><div style='float:left;margin-top:-3px;'><label>&nbsp;<span id='pageno'>" + pageNumber + "</span> Of " + totalPageCount.ToString() + "&nbsp;</label></div><div id='spnnxt'></div>&nbsp;" + strCmbBuilder.ToString() + "</div>");
                    }
                    else
                    {
                        strBuilder.Append("<div class='pgcont'><div style='float:left'>Pages: &nbsp;</div><div id='spnprev' class='pagenav' onclick='fnGoToPrevPage()'></div><div style='float:left;margin-top:-3px;'><label>&nbsp<span id='pageno'>" + pageNumber + "</span> Of " + totalPageCount.ToString() + "&nbsp;</label></div><div id='spnnxt' class='pagenav'  onclick='fnGoToNextPage()'></div>&nbsp;" + strCmbBuilder.ToString() + "</div>");
                    }
                }
            }
            return strBuilder.Append("<div style='clear:both' ></div>");
        }
        public static StringBuilder EmpInactivePaging(int pageNumber, int totalPageCount)
        {
            StringBuilder strBuilder = new StringBuilder();
            // if page count > 1 we enable paging.
            if (totalPageCount > 1)
            {
                // Start: Drop Down design
                StringBuilder strCmbBuilder = new StringBuilder();
                strCmbBuilder.Append("<select id='EmpInactivedrpPaging' onchange='fnGoToPageEmpInactive()' style='margin-top:-8px;'>");
                for (int index = 1; index <= totalPageCount; index++)
                {
                    if (pageNumber == index)
                    {
                        strCmbBuilder.Append("<option selected value=" + index.ToString() + ">");
                    }
                    else
                    {
                        strCmbBuilder.Append("<option value=" + index.ToString() + ">");
                    }
                    strCmbBuilder.Append(index.ToString());
                    strCmbBuilder.Append("</option>");
                }
                strCmbBuilder.Append("</select>");
                // End: Drop Down design

                // page number ==1 we disable the "Previous" button link.
                if (pageNumber == 1)
                {
                    strBuilder.Append("<div class='pgcont'><div style='float:left'>Pages: &nbsp;</div><div id='spnprev' ></div><div style='float:left;'><label>&nbsp;<span id='Inacivepageno'>" + pageNumber + "</span> Of " + totalPageCount.ToString() + "&nbsp;</label></div><div id='spnnxt' class='pagenav' onclick='fnGoToNextPageEmpInactive()'></div>&nbsp;" + strCmbBuilder.ToString() + "</div>");
                }
                else
                {
                    // page number reach the page count, we disable the "Next" button link.
                    if (totalPageCount == pageNumber)
                    {
                        strBuilder.Append("<div class='pgcont'><div style='float:left'>Pages: &nbsp;</div><div id='spnprev' class='pagenav' onclick='fnGoToPrevPageEmpInactive()'></div><div style='float:left;margin-top:-3px;'><label>&nbsp;<span id='Inacivepageno'>" + pageNumber + "</span> Of " + totalPageCount.ToString() + "&nbsp;</label></div><div id='spnnxt'></div>&nbsp;" + strCmbBuilder.ToString() + "</div>");
                    }
                    else
                    {
                        strBuilder.Append("<div class='pgcont'><div style='float:left'>Pages: &nbsp;</div><div id='spnprev' class='pagenav' onclick='fnGoToPrevPagEmpInactivee()'></div><div style='float:left;margin-top:-3px;'><label>&nbsp<span id='Inacivepageno'>" + pageNumber + "</span> Of " + totalPageCount.ToString() + "&nbsp;</label></div><div id='spnnxt' class='pagenav'  onclick='fnGoToNextPageEmpInactive()'></div>&nbsp;" + strCmbBuilder.ToString() + "</div>");
                    }
                }
            }
            return strBuilder.Append("<div style='clear:both' ></div>");
        }
    }
}