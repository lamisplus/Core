
export const Age = (date)=>{
  if(!date){
    return ;
  }
    var today = new Date();
    var dateParts = date.split("-");
    var dateObject = new Date(+dateParts[0], dateParts[1] - 1, +dateParts[2]);
    var birthDate = new Date(dateObject);  // create a date object directly from `dob1` argument
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
    {
      age_now--;
    }
  
    if(age_now === 0){
      return m + ' month(s)';
    }
    return age_now + ' year(s)';
}