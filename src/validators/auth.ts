import { z } from 'zod'

const userRoles = z.enum(['customer', 'admin', 'professional', 'supplier'])

export type UserRoles = z.infer<typeof userRoles>

const passwordSchema = z.string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres." })
    .regex(/[A-Z]/, { message: "A senha deve conter pelo menos uma letra maiúscula." })
    .regex(/[a-z]/, { message: "A senha deve conter pelo menos uma letra minúscula." })
    .regex(/[0-9]/, { message: "A senha deve conter pelo menos um número." })
    .regex(/[\W_]/, { message: "A senha deve conter pelo menos um caractere especial." })

export const signInSchema = z.object({
    email: z.string().email('E-mail inválido.'),
    password: passwordSchema,
})

export type SignInPayload = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
    name: z.string(),
    email: z.string().email('E-mail inválido.'),
    username: z.string()
        .min(3, "Nome de usuário deve ter ao menos 3 caracteres.")
        .max(30, "Nome de usuário deve ter até 30 caracteres.")
        .regex(/^[a-z0-9._]+$/, "Deve conter apenas letras minúsculas, números, underline e ponto.")
        .regex(/^(?!.*\.\.)(?!.*\.$)[a-z0-9._]+$/, "Nome de usuário inválido."),
    password: passwordSchema,
    role: userRoles,
})

export type SignUpPayload = z.infer<typeof signUpSchema>;