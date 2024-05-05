import React, { useEffect } from 'react'
import { callAPI } from '../../Comman/api'
import Select from 'react-select';


const WeekDayListing = () => {

  const getJobsData = () => {
    const reqBody = {
      limit: 20,
      offset: 0
    }
    callAPI('POST', `https://api.weekday.technology/adhoc/getSampleJdJSON`, reqBody)
      .then((res) => {
        console.log("res", res);
      })
  }

  useEffect(() => {
    getJobsData();
  }, [])

  return (
    <React.Fragment>
      <div className='w_recruit'>
        <div className='w_container'>
          <div className='w_recruit-filter w_flex w_align-center w_flex-wrap w_p-10'>

            <div className='w_width-10 w_mr-10'>
              <Select
                // defaultValue={[colourOptions[2], colourOptions[3]]}
                isMulti
                // name="colors"
                // options={colourOptions}
                className='w_w-full'
              />
            </div>
            <div className='w_width-10 w_mr-10'>
              <Select
                // defaultValue={[colourOptions[2], colourOptions[3]]}
                isMulti
                // name="colors"
                // options={colourOptions}
                className='w_w-full'
              />
            </div>
          </div>

          <div className='w_recruit-content'>


            {/* // Mapping */}
            <div className='w_recruit-content-inner'>
              <div className='w_recruit-content-inner-label w_inline-flex w_align-center'>
                ⏳ Posted 19 days ago
              </div>

              <div className='w_flex w_align-center w_recruit-content-inner-profile'>
                <div className='w_recruit-content-inner-profile-logo'>
                  <img src='https://storage.googleapis.com/weekday-assets/airtableAttachment_1713271734116_1ci60.png' alt='Logo' />
                </div>
                <div className='w_recruit-content-inner-profile-content'>
                  <h3>DeGenerous</h3>
                  <h4>Frontend Engineer</h4>
                  <span>India</span>
                </div>
              </div>

              <span className='w_recruit-content-inner-salary'>Estimated Salary: ₹30 - 35 LPA ✅</span>

              <div className='w_flex w_align-start w_flex-col w_recruit-content-inner-dec'>
                <h5>About Company:</h5>
                <h6>About us</h6>
                <p>DeGenerous DAO is building an ecosystem of user-centric gaming and storytelling products powered by AI and NFTs. The convergence of AI, gaming, and Web3 allows us to form an unprecedentedly decentralized franchise and establish the infrastructure for the next generation of entertainment based on interactive storytelling and inclusivity.</p>


                <span>Founder/Recruiter profiles:</span>
              </div>

              <div className='w_recruit-content-inner-viewjob w_flex w_align-center w_content-center'><a href=''>View job</a></div>

              <div className='w_recruit-content-inner-experience'>
                <span>Minimum Experience</span>
                <p>2 years</p>
              </div>

              <button className='w_cp'>⚡ Easy Apply</button>
            </div>


          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
export default WeekDayListing;