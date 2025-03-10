import {useEffect, useRef, useState} from 'react';
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import {ArrowUpCircle, Clock, Pencil, PlusCircle, Trash2, XCircle} from 'lucide-react';
import {AnimatePresence, motion} from 'framer-motion';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {cn} from "@/lib/utils"

// Define the Task type
interface Task {
    id: string;
    title: string;
    description: string;
    duration: string;
}

// Main App Component
const ToDoListApp = () => {
    // State for managing tasks and form inputs
    const [tasks, setTasks] = useState<Task[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [durationError, setDurationError] = useState('');
    const [showScrollToTop, setShowScrollToTop] = useState(false);

    // Check scroll position and if there is scrollable content
    useEffect(() => {
        const handleScroll = () => {
            // Only show button if the document is scrollable and the user has scrolled down
            if (document.documentElement.scrollHeight > window.innerHeight && window.scrollY > 0) {
                setShowScrollToTop(true);
            } else {
                setShowScrollToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Call on mount in case content is already scrolled
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Function to add a new task
    const addTask = () => {
        let hasError = false;
        if (!title.trim()) {
            setTitleError("This field is required");
            hasError = true;
        }
        if (!description.trim()) {
            setDescriptionError("This field is required");
            hasError = true;
        }
        if (!duration.trim()) {
            setDurationError("This field is required");
            hasError = true;
        }

        if (hasError) {
            return;
        }

        const newTask: Task = {
            id: Date.now().toString(),
            title,
            description,
            duration,
        };
        setTasks([...tasks, newTask]);
        clearForm();
    };

    // Function to remove a task
    const removeTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    // Function to start editing a task
    const startEditTask = (task: Task) => {
        setEditingTaskId(task.id);
        setTitle(task.title);
        setDescription(task.description);
        setDuration(task.duration);
        // Smooth scroll to the top of the container
        containerRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    // Function to save edited task
    const saveEditedTask = () => {
        let hasError = false;
        if (!title.trim()) {
            setTitleError("This field is required");
            hasError = true;
        }
        if (!description.trim()) {
            setDescriptionError("This field is required");
            hasError = true;
        }
        if (!duration.trim()) {
            setDurationError("This field is required");
            hasError = true;
        }

        if (hasError) {
            return;
        }

        setTasks(
            tasks.map((task) =>
                task.id === editingTaskId
                    ? {...task, title, description, duration}
                    : task
            )
        );
        clearForm();
        setEditingTaskId(null);
    };

    // Function to discard editing
    const discardEdit = () => {
        clearForm();
        setEditingTaskId(null);
    };

    // Function to clear the form
    const clearForm = () => {
        setTitle('');
        setDescription('');
        setDuration('');
        setTitleError('');
        setDescriptionError('');
        setDurationError('');
    };

    // Function to scroll to top
    const scrollToTop = () => {
        containerRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#A3A0FF] to-[#5E7BFF]">
                    To-Do List
                </h1>
                <p className="text-center text-gray-400">Stay Organized, Get Things Done!</p>

                {/* Task Input Form */}
                <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl text-white">
                            {editingTaskId ? 'Edit Task' : 'Add New Task'}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            {editingTaskId ? 'Modify the task details below.' : 'Add a new task to your list.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    setTitleError('');
                                }}
                                className={cn(
                                    "bg-black/20 text-white border-gray-700 placeholder:text-gray-400",
                                    titleError && "border-red-500 focus-visible:ring-red-500"
                                )}
                            />
                            {titleError && <p className="text-red-500 text-sm">{titleError}</p>}
                        </div>
                        <div className="space-y-2">
                            <Textarea
                                placeholder="Description"
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    setDescriptionError('');
                                }}
                                className={cn(
                                    "bg-black/20 text-white border-gray-700 placeholder:text-gray-400",
                                    descriptionError && "border-red-500 focus-visible:ring-red-500"
                                )}
                            />
                            {descriptionError && <p className="text-red-500 text-sm">{descriptionError}</p>}
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="text"
                                placeholder="Duration (e.g., 1 hour)"
                                value={duration}
                                onChange={(e) => {
                                    setDuration(e.target.value);
                                    setDurationError('');
                                }}
                                className={cn(
                                    "bg-black/20 text-white border-gray-700 placeholder:text-gray-400",
                                    durationError && "border-red-500 focus-visible:ring-red-500"
                                )}
                            />
                            {durationError && <p className="text-red-500 text-sm">{durationError}</p>}
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        {editingTaskId ? (
                            <>
                                <Button
                                    onClick={discardEdit}
                                    className="bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 hover:text-gray-300 w-1/2 cursor-pointer"
                                >
                                    <XCircle className="mr-2 h-4 w-4"/>
                                    Discard
                                </Button>
                                <Button
                                    onClick={saveEditedTask}
                                    className="bg-[#0763E4] text-white hover:bg-[#0763E4]/80 w-1/2 cursor-pointer"
                                >
                                    Save
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={addTask}
                                className="bg-[#3B6AFF] text-white hover:bg-[#0B2FD4] w-full cursor-pointer"
                            >
                                <PlusCircle className="mr-2 h-4 w-4"/>
                                Add Task
                            </Button>
                        )}
                    </CardFooter>
                </Card>

                {/* Task List */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {tasks.length === 0 ? (
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                            >
                                <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
                                    <CardContent className="p-4 text-center text-gray-400">
                                        No tasks yet. Add some tasks to get started!
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ) : (
                            tasks.map((task) => (
                                <motion.div
                                    key={task.id}
                                    initial={{opacity: 0, y: -10}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: 10}}
                                    transition={{duration: 0.2}}
                                >
                                    <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
                                        <CardHeader className="flex flex-row items-center justify-between pb-0">
                                            <CardTitle className="text-lg text-white">{task.title}</CardTitle>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => startEditTask(task)}
                                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-full cursor-pointer"
                                                >
                                                    <Pencil className="h-4 w-4"/>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeTask(task.id)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full cursor-pointer"
                                                >
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex flex-col text-gray-300">
                                            <CardDescription
                                                className="text-white py-4">{task.description}</CardDescription>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-gray-400"/>
                                                <span>{task.duration}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Scroll To Top Button */}
            {showScrollToTop && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={scrollToTop}
                                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 hover:text-gray-300 cursor-pointer px-4 py-2"
                            >
                                <ArrowUpCircle className="h-6 w-6"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="text-white">
                            <p>Scroll to top</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    );
};

export default ToDoListApp;
