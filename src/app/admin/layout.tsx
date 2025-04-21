import AdminLayout from "@/components/adminLayout"


type Props = {
    children: React.ReactNode
}
const layout = ({ children }: Props) => {

    return (
        <AdminLayout>
            {children}
        </AdminLayout>
    )
}

export default layout