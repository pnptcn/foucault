import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    EuiButton,
    EuiFieldText,
    EuiForm,
    EuiFormRow,
    EuiHorizontalRule,
    EuiPageTemplate,
    EuiSpacer,
    EuiTabbedContent,
    EuiText,
    EuiTitle
} from "@elastic/eui"

const formSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export const Auth: React.FC = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data)
    }

    const tabs = [
        {
            id: "login-tab",
            name: "Login",
            content: (
                <>
                    <EuiSpacer />
                    <EuiTitle size="s">
                        <h4>Login</h4>
                    </EuiTitle>
                    <EuiSpacer />
                    <EuiForm component="form">
                        <EuiFormRow label="Username" helpText="Please enter your username.">
                            <EuiFieldText name="username" />
                        </EuiFormRow>
                        <EuiFormRow label="Password" helpText="Please enter your username.">
                            <EuiFieldText name="username" />
                        </EuiFormRow>
                        <EuiSpacer />
                        <EuiButton type="submit" fill>
                            Submit
                        </EuiButton>
                    </EuiForm>
                </>
            )
        },
        {
            id: "signup-tab",
            name: "Sign Up",
            content: (
                <>
                    <EuiSpacer />
                    <EuiTitle size="s">
                        <h4>Sign Up</h4>
                    </EuiTitle>
                    <EuiSpacer />
                    <EuiForm component="form">
                        <EuiFormRow label="Username" helpText="Please enter your username.">
                            <EuiFieldText name="username" />
                        </EuiFormRow>
                        <EuiFormRow label="Password" helpText="Please enter your username.">
                            <EuiFieldText name="username" />
                        </EuiFormRow>
                        <EuiSpacer />
                        <EuiButton type="submit" fill>
                            Submit
                        </EuiButton>
                    </EuiForm>
                </>
            )
        }
    ]

    return (
        <EuiPageTemplate>
            <EuiPageTemplate.Section>
                <EuiTitle size="m">
                    <h3>Foucault</h3>
                </EuiTitle>
                <EuiText>
                    <blockquote>Making windows where there were once walls.</blockquote>
                </EuiText>
                <EuiTabbedContent tabs={tabs} initialSelectedTab={tabs[0]} />
            </EuiPageTemplate.Section>
        </EuiPageTemplate>
    )
}

export default Auth
