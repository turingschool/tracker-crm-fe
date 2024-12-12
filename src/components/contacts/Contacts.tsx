

function Contacts() {

  return (
    <section>
      <h1 className="text-[5vw] font-bold text-cyan-600">Colors</h1>
      {/* <p>Hello World!</p> */}
      <div className="bg-cyan-600">
        <p>Cyan-600</p>
        <p>H1 tags: Hello message, Contacts, Companies, Job Applications</p>
        <p>Buttons: Edit, Add New +, Save</p>
      </div>
      <div className="bg-cyan-800">
        <p>Cyan-800</p>
        <p>Login Page: Right-Half of Page, Login Button</p>
      </div>
      <div className="bg-sky-200">
        <p>Sky-200</p>
        <p>Title on Login Page: "Tracker", "Job hunting made easier."</p>
      </div>
      <div className="bg-cyan-500">
        <p>Cyan-500</p>
        <p>Links: Read More, Add New Contact</p>
      </div>
    </section>
  )
}

export default Contacts;