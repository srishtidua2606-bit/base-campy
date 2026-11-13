import {useState} from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:8000"

function CreateProjectModal({ onClose, onProjectCreated }){
    //Form field states
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");

    //UI states
    const [loading , setLoading ]  = useState(false);
    const [error , setError]  = useState("");

    async function handleSubmit(event){
        event.preventDefault();

        setLoading(true)
        setError("")
        //backend request
        try{
            const response= await fetch(`${API_BASE_URL}/api/v1/projects/`,{
                method:"POST",
                credentials:"include",
                headers : {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    name,
                    description,
                    deadline:deadline || null,
                })
            })

            const result = response.json();
            if (!response.ok){
                throw new Error(result?.message || "Unable to create project.");
            }

            onProjectCreated(result.data)

            onClose()
        }catch (error){
            setError(error.message || "Something went wrong.");

        }finally{
            setLoading(false)
        }
    }

    return(
        <div className = "project-modal-overlay">
        <div className = "project-modal"
        role ="dialog" aria-modal="true" aria-labelledBy = "create-project-title">
            <div className = "project-modal-header">
                <div>
                    <h2 id="create-project-title">Create a new project</h2>
            <p>Set up a workspace for your next big idea.</p>
  </div>
            <button
                 type="button"
            className="project-modal-close"
            onClick={onClose}
            aria-label="Close modal"> &times;
            </button>
                </div>
                <form onSubmit = {handleSubmit}>
                    <div className = "project-form-group">
                        <label htmlFor = "project-name">Project name</label>
                        <input id= "project-name" type="text" placeholder ="Enter project name" value = {name} onChange = {(event) => setName(event.target.value) }required />
                    </div>

                    <div className = "project-form-group">
                        <label htmlFor = "project-description">Description</label>
                        <textarea id = "project-description" placeholer = "What is this project about?" value ={description} onChange={(event) => setDescription(event.target.value)} rows={4}/>
                    </div>
                    <div className = "project-form-group">
                        <label htmlFor = "project-deadline">Deadline</label>
                        <input id = "project-deadline" type ="date" value ={deadline} onChange = {(e) => setDeadline(e.target.value)}
                        />
                    </div>

                    {error && <p className = "project-form-error">{error}</p>}

                    <div className = "project-modal-actions">
                        <button type ="button" className = "project-cancel-btn" onClick= {onClose} disabled = {loading}>Cancel</button>

                        <button className = "project-create-btn" type ="submit" disabled ={loading}>
                            {loading ? "Creating...": "Create Project"}
                        </button>
                    </div>


                </form>

            </div>

        </div>
     
    )


}

export default CreateProjectModal;