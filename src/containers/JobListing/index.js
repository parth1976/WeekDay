import React, { useEffect, useState } from 'react'
import { callAPI } from '../../Comman/api'
import Select from 'react-select';
import { titleCase } from '../../Comman/utils';


const WeekDayListing = () => {
  const [orginalData, setOrginalData] = useState([]);
  const [jobListingData, setjobListingData] = useState([])
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [isMoreData, setIsMoreData] = useState(true);
  const [filter, setFilter] = useState({});
  const [jobRoleOptions, setJobRoleOptions] = useState([])

  const noOfEmployeesOptions = [
    { value: { from: 1, to: 10 }, label: '1-10' },
    { value: { from: 11, to: 20 }, label: '11-20' },
    { value: { from: 21, to: 50 }, label: '21-50' },
    { value: { from: 51, to: 100 }, label: '51-100' },
    { value: { from: 101, to: 200 }, label: '101-200' },
    { value: { from: 201, to: 500 }, label: '201-500' },
    { value: { from: 501, to: 'infinate' }, label: '500+' }
  ]

  const experienceOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
    { value: 9, label: '9' },
    { value: 10, label: '10' }
  ]

  const locationOptions = [
    { value: 1, label: 'Remote' },
    { value: 2, label: 'Hybrid' },
    { value: 3, label: 'In-Office' }
  ]

  const salaryOptions = [
    { value: 0, label: '0L' },
    { value: 10, label: '10L' },
    { value: 20, label: '20L' },
    { value: 30, label: '30L' },
    { value: 40, label: '40L' },
    { value: 50, label: '50L' },
    { value: 60, label: '60L' },
    { value: 70, label: '70L' },
  ]

  useEffect(() => {
    if (isMoreData) {
      getJobsData();
    }
  }, [offset])

  const getJobsData = () => {
    const reqBody = {
      limit: limit,
      offset: offset
    }
    callAPI('POST', `https://api.weekday.technology/adhoc/getSampleJdJSON`, reqBody)
      .then((res) => {
        if (res) {
          const listing = res?.jdList;
          const options = [...jobRoleOptions];
          listing.forEach(item => {
            if (!options.some(option => option.value == item.jobRole)) {
              options.push({ value: item?.jobRole, label: titleCase(item?.jobRole) });
            }
          });
          if (options.length > 0) {
            setJobRoleOptions(options)
          }
          setIsMoreData(res?.totalCount >= offset)
          setjobListingData(prevData => [...prevData, ...listing]);
          setOrginalData(prevData => [...prevData, ...listing]);
        }
      })
  }

  const onScroll = (e) => {
    const { target } = e;
    const isScrolledToBottoam = Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 2;
    if (isScrolledToBottoam) {
      setOffset(prevOffset => prevOffset + limit);
    }
  }

  const handleFilter = () => {
    let orginalListingData = [...orginalData];
    if (orginalListingData.length > 0) {
      //jobrole filter
      if (filter?.jobRole?.length > 0) {
        for (let i = orginalListingData.length - 1; i >= 0; i--) {
          const job = orginalListingData[i];
          let matchFound = false;
          for (let j = 0; j < filter.jobRole.length; j++) {
            const filterItem = filter.jobRole[j];

            if (job.jobRole === filterItem.value) {
              matchFound = true;
              break;
            }
          }
          if (!matchFound) {
            orginalListingData.splice(i, 1);
          }
        }
      }

      // experience filter
      if (filter?.experience) {
        for (let i = orginalListingData.length - 1; i >= 0; i--) {
          const job = orginalListingData[i];
          if (!(job.minExp <= filter.experience.value)) {
            orginalListingData.splice(i, 1);
          }
        }
      }

      // salary filter
      if (filter?.salary) {
        for (let i = orginalListingData.length - 1; i >= 0; i--) {
          const job = orginalListingData[i];
          // Check if the minExp is not greater than the salary filter value
          if (!(job.minJdSalary > filter.salary.value)) {
            // If not, remove the job object from the data array
            orginalListingData.splice(i, 1);
          }
        }
      }

      // Search Filter
      if (filter?.searchText && filter?.searchText.length != 0) {
        for (let i = orginalListingData.length - 1; i >= 0; i--) {
          const job = orginalListingData[i];
          if (!job.companyName.toLowerCase().includes(filter.searchText.toLowerCase())) {
            orginalListingData.splice(i, 1);
          }
        }
      }
      setjobListingData(orginalListingData);
      orginalListingData = [];
    }
  }

  useEffect(() => {
    if (Object.keys(filter).length > 0) {
      handleFilter()
    }
  }, [filter, orginalData])


  return (
    <React.Fragment>
      <div onScroll={onScroll} className='w_recruit w_recruit-scroll'>
        <div className='w_container'>
          <div className='w_recruit-filter w_flex w_align-center w_flex-wrap w_p-10'>

            <div className='w_width-15 w_mr-10'>
              <Select
                isMulti
                options={jobRoleOptions}
                className='w_w-full'
                onChange={(e) => {
                  if (e.length > 0) {
                    setFilter({
                      ...filter,
                      jobRole: e
                    })
                  } else {
                    const { jobRole, ...filterWithoutJobRole } = filter;
                    setFilter(filterWithoutJobRole)
                  }
                }}
              />
            </div>
            <div className='w_width-18 w_mr-10'>
              <Select
                isMulti
                options={noOfEmployeesOptions}
                placeholder="Number Of Employees"
                className='w_w-full'
                onChange={(e) => {
                  if (e.length > 0) {
                    setFilter({
                      ...filter,
                      employeeNo: e
                    })
                  } else {
                    const { employeeNo, ...filterWithoutJobRole } = filter;
                    setFilter(filterWithoutJobRole)
                  }
                }}
              />
            </div>
            <div className='w_width-12 w_mr-10'>
              <Select
                isClearable
                options={experienceOptions}
                placeholder="Experience"
                className='w_w-full'
                onChange={(e) => {
                  if (e) {
                    setFilter({
                      ...filter,
                      experience: e
                    })
                  } else {
                    const { experience, ...filterWithoutJobRole } = filter;
                    setFilter(filterWithoutJobRole)
                  }
                }}
              />
            </div>
            <div className='w_width-12 w_mr-10'>
              <Select
                options={locationOptions}
                placeholder="Remote"
                className='w_w-full'
              />
            </div>
            <div className='w_width-18 w_mr-10'>
              <Select
                isClearable
                options={salaryOptions}
                placeholder="Minumum Base Pay"
                className='w_w-full'
                onChange={(e) => {
                  if (e) {
                    setFilter({
                      ...filter,
                      salary: e
                    })
                  } else {
                    const { salary, ...filterWithoutJobRole } = filter;
                    setFilter(filterWithoutJobRole)
                  }
                }}
              />
            </div>
            <div className='w_width-10 w_mr-10'>
              <input
                placeholder="Search For Jobs"
                className='w_search'
                onChange={(e) => {
                  {console.log("e" , e);}
                  if (e && e.target.value.length != 0) {
                    setFilter({
                      ...filter,
                      searchText: e.target.value
                    })
                  } else {
                    const { searchText, ...filterWithoutJobRole } = filter;
                    setFilter(filterWithoutJobRole)
                  }
                }}
              />
            </div>
          </div>

          <div className={`w_recruit-content ${jobListingData?.length > 0 ? '' : 'w_width-full w_flex w_align-center w_content-center'}`}>
            {jobListingData?.length > 0 ? jobListingData.map((x, i) => (
              <div className='w_recruit-content-inner'>
                <div className='w_recruit-content-inner-label w_inline-flex w_align-center'>
                  ⏳ Posted 19 days ago
                </div>
                <div className='w_flex w_align-center w_recruit-content-inner-profile'>
                  <div className='w_recruit-content-inner-profile-logo'>
                    <img src={x?.logoUrl} alt='Logo' />
                  </div>
                  <div className='w_recruit-content-inner-profile-content'>
                    <h3>{x?.companyName}</h3>
                    <h4>{titleCase(x?.jobRole) || "Front-End"}</h4>
                    <span>{titleCase(x?.location) || "India"}</span>
                  </div>
                </div>
                <span className='w_recruit-content-inner-salary'>Estimated Salary: {x?.salaryCurrencyCode == 'USD' ? '$' : '₹'}{x?.minJdSalary || 0} - {x?.maxJdSalary || 50} LPA ✅</span>
                <div className='w_flex w_align-start w_flex-col w_recruit-content-inner-dec'>
                  <h5>About Company:</h5>
                  <h6>About us</h6>
                  <p>{x?.jobDetailsFromCompany}</p>
                  {/* <span>Founder/Recruiter profiles:</span> */}
                </div>
                <div className='w_recruit-content-inner-viewjob w_flex w_align-center w_content-center'><a href={x?.jdLink}>View job</a></div>
                <div className='w_recruit-content-inner-experience'>
                  <span>Minimum Experience</span>
                  <p>{x?.minExp || 0} years</p>
                </div>
                <button className='w_cp'>⚡ Easy Apply</button>
              </div>
            )) : <div className='w_align-center w_flex w_content-center w_recruit-content-notfound w_flex-col'>
              <img src='https://jobs.weekday.works/_next/static/media/nothing-found.4d8f334c.png' alt='Logo' />
              <h6>No Data Found</h6>
            </div>}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
export default WeekDayListing;