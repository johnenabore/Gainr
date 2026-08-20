import BottomNav from "@/components/home/bottomNav"
import Header from "@/components/home/header"

const AppLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div >
            <Header />
            {children}
            <BottomNav />
        </div>
    )
}

export default AppLayout