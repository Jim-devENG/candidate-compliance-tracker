<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCredentialRequest extends FormRequest
{
    /**
     * Sanitize input before validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('status') && $this->input('status') === '') {
            $this->merge(['status' => null]);
        }
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // For now, allow all authenticated users
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'candidate_name' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'credential_type' => ['required', 'string', 'max:255'],
            'issue_date' => ['required', 'date'],
            'expiry_date' => ['required', 'date', 'after:issue_date'],
            'email' => ['required', 'email', 'max:255'],
            'status' => ['sometimes', 'nullable', 'string', 'in:active,expired,expiring_soon,pending'],
            'document' => ['sometimes', 'file', 'mimes:pdf,doc,docx', 'max:5120'], // up to 5MB
        ];
    }
}
