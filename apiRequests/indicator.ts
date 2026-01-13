import http from '@/lib/http'
import { DashboardIndicatorQueryParamsType, DashboardIndicatorResType } from '@/schemaValidations/indicator.schema'
import queryString from 'query-string'

const indicatorApiRequest = {
  getDashboardIndicators: (queryParams: DashboardIndicatorQueryParamsType) =>
    http.get<DashboardIndicatorResType>(
      '/indicators/dashboard?' +
        queryString.stringify({
          fromDate: queryParams.fromDate?.toDateString(),
          toDate: queryParams.toDate?.toDateString()
        })
    )
}

export default indicatorApiRequest
