import React, { useEffect, useState } from 'react'
import { callAPI } from '../../Comman/api'
import Select from 'react-select';
import { titleCase } from '../../Comman/utils';


const WeekDayListing = () => {
  const [orginalData, setOrginalData] = useState([]); // set orginal data for handle filter
  const [jobListingData, setjobListingData] = useState([]) // cards listing data for jobs 
  const [offset, setOffset] = useState(0); // set offset here so its auto set and incremented
  const limit = 10; // limit for get data
  const [isMoreData, setIsMoreData] = useState(true); // when there is no data no api will be called with help of this
  const [filter, setFilter] = useState({}); // store all the filters here 
  const [jobRoleOptions, setJobRoleOptions] = useState([]) // dynammic options for jobs role so if in data get any other jobRole which is not in options its add dynamically 

  // option for number of employees dropdown this filter is not supported because there is no number of employees in the data set
  const noOfEmployeesOptions = [
    { value: { from: 1, to: 10 }, label: '1-10' },
    { value: { from: 11, to: 20 }, label: '11-20' },
    { value: { from: 21, to: 50 }, label: '21-50' },
    { value: { from: 51, to: 100 }, label: '51-100' },
    { value: { from: 101, to: 200 }, label: '101-200' },
    { value: { from: 201, to: 500 }, label: '201-500' },
    { value: { from: 501, to: 'infinate' }, label: '500+' }
  ]

  // options for minimum expeience 
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

  // options for location options this filter is not supported becase there is no option will mention in the dataset 
  const locationOptions = [
    { value: 1, label: 'Remote' },
    { value: 2, label: 'Hybrid' },
    { value: 3, label: 'In-Office' }
  ]

  // option for minimum base pay dropdown
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

  //intially call the api for get the data and then update my offset onscroll set so this useEfeect is triggered and i get updated data
  useEffect(() => {
    if (isMoreData) {
      getJobsData();
    }
  }, [offset])

  //get the intial data for jobs searching here one comman function is called which is callApi in which i need to pass method , url and data 
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
          if (Object.keys(filter).length > 0) {
            handleFilter([...orginalData , ...listing])
          }else{
            setjobListingData(prevData => [...prevData, ...listing]);
          }
          setIsMoreData(res?.totalCount >= offset)
          setOrginalData(prevData => [...prevData, ...listing]);
        }
      })
  }

  // this function will set the offset regarding the position of the scroll
  const onScroll = (e) => {
    const { target } = e;
    const isScrolledToBottoam = Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 2;
    if (isScrolledToBottoam) {
      setOffset(prevOffset => prevOffset + limit);
    }
  }


  // this is comman function for handle all filters here i take orginal data and when filter chnages its filters from orginal data and set the filterdData to the listing
  const handleFilter = (data) => {
    let originalListingData = data ? [...data] : [...orginalData];
  
    if (originalListingData.length > 0) {
  
      for (let i = originalListingData.length - 1; i >= 0; i--) {
        const job = originalListingData[i];
  
        // Job Role Filter
        if (filter?.jobRole?.length > 0) {
          let matchFound = false;
          for (let j = 0; j < filter.jobRole.length; j++) {
            const filterItem = filter.jobRole[j];

            if (job.jobRole === filterItem.value) {
              matchFound = true;
              continue;
            }
          }
          if (!matchFound) {
            originalListingData.splice(i, 1);
            continue
          }
        }
  
        // Experience Filter
        if (filter?.experience) {
          if (!(job.minExp <= filter.experience.value)) {
            originalListingData.splice(i, 1);
            continue;
          }
        }
  
        // Salary Filter
        if (filter?.salary) {
          if (!(job.minJdSalary > filter.salary.value)) {
            originalListingData.splice(i, 1);
            continue;
          }
        }
  
        // Search Filter
        if (filter?.searchText && filter?.searchText.length !== 0) {
          if (!job.companyName.toLowerCase().includes(filter.searchText.toLowerCase())) {
            originalListingData.splice(i, 1);
            continue;
          }
        }
      }
    }
    setjobListingData(originalListingData);
  };
  
//cal handle filter when any filter is applied or removed
  useEffect(() => {
      handleFilter()
  }, [filter])


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